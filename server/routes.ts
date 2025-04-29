import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  insertHouseholdSchema, 
  insertChoreSchema,
  insertNotificationSchema
} from "@shared/schema";
import { z } from "zod";

// Custom session type
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// WebSocket clients
interface ConnectedClient {
  userId: number;
  socket: WebSocket;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session handling
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: "choresync-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 1 day
      store: new SessionStore({
        checkPeriod: 86400000, // 24 hours
      }),
    })
  );

  // Set up passport authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Middleware to check if a user is authenticated
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info.message || "Authentication failed" });
        }
        req.logIn(user, (err) => {
          if (err) return next(err);
          req.session.userId = user.id;
          return res.json({ user: { id: user.id, username: user.username, fullName: user.fullName, email: user.email, householdId: user.householdId } });
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const userData = registerSchema.parse(req.body);
      const { confirmPassword, ...userInsertData } = userData;
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userInsertData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userInsertData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userInsertData);
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.userId = user.id;
        return res.status(201).json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            fullName: user.fullName, 
            email: user.email, 
            householdId: user.householdId 
          } 
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error destroying session" });
        }
        res.json({ message: "Logged out successfully" });
      });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const user = req.user as any;
    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName, 
        email: user.email,
        avatarColor: user.avatarColor,
        householdId: user.householdId 
      } 
    });
  });

  // Household routes
  app.post("/api/households", requireAuth, async (req, res, next) => {
    try {
      const householdData = insertHouseholdSchema.parse({
        ...req.body,
        createdById: (req.user as any).id,
      });
      const household = await storage.createHousehold(householdData);
      
      // Update the user's household
      await storage.updateUserHousehold((req.user as any).id, household.id);
      
      res.status(201).json(household);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  app.get("/api/households/:id", requireAuth, async (req, res) => {
    const householdId = parseInt(req.params.id);
    const household = await storage.getHousehold(householdId);
    
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    
    const members = await storage.getHouseholdUsers(householdId);
    
    res.json({ household, members });
  });

  app.get("/api/households/current", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(404).json({ message: "User not in a household" });
    }
    
    const household = await storage.getHousehold(user.householdId);
    
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    
    const members = await storage.getHouseholdUsers(user.householdId);
    
    res.json({ household, members });
  });

  // Chore routes
  app.post("/api/chores", requireAuth, async (req, res, next) => {
    try {
      const user = req.user as any;
      if (!user.householdId) {
        return res.status(400).json({ message: "User not in a household" });
      }
      
      const choreData = insertChoreSchema.parse({
        ...req.body,
        householdId: user.householdId,
      });
      
      const chore = await storage.createChore(choreData);
      
      // Create a notification for the assigned user if not the creator
      if (choreData.assignedToId && choreData.assignedToId !== user.id) {
        await storage.createNotification({
          userId: choreData.assignedToId,
          type: "chore_assigned",
          message: `${user.fullName} assigned you the chore "${chore.name}"`,
          choreId: chore.id,
        });
        
        // Notify this user via WebSocket if they're connected
        const assignedUserClient = connectedClients.find(
          client => client.userId === choreData.assignedToId
        );
        
        if (assignedUserClient && assignedUserClient.socket.readyState === WebSocket.OPEN) {
          assignedUserClient.socket.send(JSON.stringify({
            type: "new_notification",
            data: {
              message: `${user.fullName} assigned you the chore "${chore.name}"`,
              choreId: chore.id
            }
          }));
        }
      }
      
      broadcastToHousehold(user.householdId, {
        type: "chore_created",
        data: chore
      });
      
      res.status(201).json(chore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  app.get("/api/chores", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const chores = await storage.getChoresByHousehold(user.householdId);
    res.json(chores);
  });

  app.get("/api/chores/today", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const chores = await storage.getTodaysChores(user.householdId);
    res.json(chores);
  });

  app.get("/api/chores/upcoming", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const days = parseInt(req.query.days as string || "7");
    const chores = await storage.getUpcomingChores(user.householdId, days);
    res.json(chores);
  });

  app.get("/api/chores/overdue", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const chores = await storage.getOverdueChores(user.householdId);
    res.json(chores);
  });

  app.get("/api/chores/my", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const chores = await storage.getChoresByUser(user.id);
    res.json(chores);
  });

  app.post("/api/chores/:id/complete", requireAuth, async (req, res, next) => {
    try {
      const choreId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Verify the chore exists
      const chore = await storage.getChore(choreId);
      if (!chore) {
        return res.status(404).json({ message: "Chore not found" });
      }
      
      // Complete the chore
      const completedChore = await storage.completeChore(choreId, user.id);
      
      // If someone else completed the chore assigned to another user, notify them
      if (completedChore.assignedToId && completedChore.assignedToId !== user.id) {
        const assignedUser = await storage.getUser(completedChore.assignedToId);
        if (assignedUser) {
          await storage.createNotification({
            userId: completedChore.assignedToId,
            type: "chore_completed_by_other",
            message: `${user.fullName} completed your chore "${completedChore.name}"`,
            choreId: choreId,
          });
          
          // Notify this user via WebSocket if they're connected
          const assignedUserClient = connectedClients.find(
            client => client.userId === completedChore.assignedToId
          );
          
          if (assignedUserClient && assignedUserClient.socket.readyState === WebSocket.OPEN) {
            assignedUserClient.socket.send(JSON.stringify({
              type: "new_notification",
              data: {
                message: `${user.fullName} completed your chore "${completedChore.name}"`,
                choreId: choreId
              }
            }));
          }
        }
      }
      
      // Broadcast chore completion to entire household
      broadcastToHousehold(user.householdId, {
        type: "chore_completed",
        data: completedChore
      });
      
      res.json(completedChore);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/chores/:id", requireAuth, async (req, res) => {
    const choreId = parseInt(req.params.id);
    const chore = await storage.getChore(choreId);
    
    if (!chore) {
      return res.status(404).json({ message: "Chore not found" });
    }
    
    res.json(chore);
  });

  app.patch("/api/chores/:id", requireAuth, async (req, res, next) => {
    try {
      const choreId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Verify the chore exists
      const chore = await storage.getChore(choreId);
      if (!chore) {
        return res.status(404).json({ message: "Chore not found" });
      }
      
      // Verify the chore belongs to the user's household
      if (chore.householdId !== user.householdId) {
        return res.status(403).json({ message: "Not authorized to modify this chore" });
      }
      
      // Update the chore
      const updatedChore = await storage.updateChore(choreId, req.body);
      
      // If assignedToId changed, notify the newly assigned user
      if (req.body.assignedToId && req.body.assignedToId !== chore.assignedToId) {
        await storage.createNotification({
          userId: req.body.assignedToId,
          type: "chore_assigned",
          message: `${user.fullName} assigned you the chore "${updatedChore.name}"`,
          choreId: choreId,
        });
        
        // Notify this user via WebSocket if they're connected
        const assignedUserClient = connectedClients.find(
          client => client.userId === req.body.assignedToId
        );
        
        if (assignedUserClient && assignedUserClient.socket.readyState === WebSocket.OPEN) {
          assignedUserClient.socket.send(JSON.stringify({
            type: "new_notification",
            data: {
              message: `${user.fullName} assigned you the chore "${updatedChore.name}"`,
              choreId: choreId
            }
          }));
        }
      }
      
      broadcastToHousehold(user.householdId, {
        type: "chore_updated",
        data: updatedChore
      });
      
      res.json(updatedChore);
    } catch (error) {
      next(error);
    }
  });

  // Notification routes
  app.get("/api/notifications", requireAuth, async (req, res) => {
    const user = req.user as any;
    const notifications = await storage.getNotificationsByUser(user.id);
    res.json(notifications);
  });

  app.get("/api/notifications/unread", requireAuth, async (req, res) => {
    const user = req.user as any;
    const notifications = await storage.getUnreadNotificationsByUser(user.id);
    res.json(notifications);
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res, next) => {
    try {
      const notificationId = parseInt(req.params.id);
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/notifications/read-all", requireAuth, async (req, res, next) => {
    try {
      const user = req.user as any;
      await storage.markAllNotificationsAsRead(user.id);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  });

  // Statistics endpoints
  app.get("/api/stats/dashboard", requireAuth, async (req, res) => {
    const user = req.user as any;
    
    if (!user.householdId) {
      return res.status(400).json({ message: "User not in a household" });
    }
    
    const allChores = await storage.getChoresByHousehold(user.householdId);
    const todaysChores = await storage.getTodaysChores(user.householdId);
    const overdueChores = await storage.getOverdueChores(user.householdId);
    const members = await storage.getHouseholdUsers(user.householdId);
    
    // Calculate completion stats
    const completedTodayCount = todaysChores.filter(chore => chore.completed).length;
    const pendingCount = allChores.filter(chore => !chore.completed).length;
    const overdueCount = overdueChores.length;
    
    // Calculate user completion percentage
    const userCompletedChores = allChores.filter(
      chore => chore.completed && chore.completedById === user.id
    ).length;
    
    const userAssignedChores = allChores.filter(
      chore => chore.assignedToId === user.id
    ).length;
    
    const userCompletionPercent = userAssignedChores > 0 
      ? Math.round((userCompletedChores / userAssignedChores) * 100)
      : 0;
    
    // Calculate per-member distribution
    const memberStats = members.map(member => {
      const completedByMember = allChores.filter(
        chore => chore.completed && chore.completedById === member.id
      ).length;
      
      return {
        id: member.id,
        fullName: member.fullName,
        avatarColor: member.avatarColor,
        initials: member.fullName.split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase(),
        completedCount: completedByMember,
        percentage: allChores.length > 0
          ? Math.round((completedByMember / allChores.length) * 100)
          : 0
      };
    });
    
    // Sort by highest percentage first
    memberStats.sort((a, b) => b.percentage - a.percentage);
    
    res.json({
      completedToday: completedTodayCount,
      pending: pendingCount,
      overdue: overdueCount,
      userCompletion: userCompletionPercent,
      memberDistribution: memberStats
    });
  });

  // Set up HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connectedClients: ConnectedClient[] = [];
  
  wss.on('connection', (ws, req) => {
    // Parse userId from query parameters
    const url = new URL(req.url || '', 'http://localhost');
    const userId = parseInt(url.searchParams.get('userId') || '0');
    
    if (userId) {
      // Register this client
      connectedClients.push({ userId, socket: ws });
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          // Handle client messages (if needed)
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (err) {
          console.error('Error processing websocket message:', err);
        }
      });
      
      ws.on('close', () => {
        // Remove this client when disconnected
        const index = connectedClients.findIndex(client => 
          client.userId === userId && client.socket === ws
        );
        
        if (index !== -1) {
          connectedClients.splice(index, 1);
        }
      });
    }
  });
  
  // Function to broadcast to all users in a household
  function broadcastToHousehold(householdId: number, data: any) {
    storage.getHouseholdUsers(householdId).then(users => {
      users.forEach(user => {
        // Find all connections for this user
        const userClients = connectedClients.filter(
          client => client.userId === user.id
        );
        
        // Send message to all user's connections
        userClients.forEach(client => {
          if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(JSON.stringify(data));
          }
        });
      });
    });
  }

  return httpServer;
}
