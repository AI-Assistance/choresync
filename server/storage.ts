import { 
  User, InsertUser, 
  Household, InsertHousehold,
  Chore, InsertChore,
  Notification, InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHouseholdUsers(householdId: number): Promise<User[]>;
  updateUserHousehold(userId: number, householdId: number): Promise<User>;
  
  // Household methods
  getHousehold(id: number): Promise<Household | undefined>;
  createHousehold(household: InsertHousehold): Promise<Household>;
  
  // Chore methods
  getChore(id: number): Promise<Chore | undefined>;
  getChoresByHousehold(householdId: number): Promise<Chore[]>;
  getChoresByUser(userId: number): Promise<Chore[]>;
  getTodaysChores(householdId: number): Promise<Chore[]>;
  getUpcomingChores(householdId: number, days: number): Promise<Chore[]>;
  getOverdueChores(householdId: number): Promise<Chore[]>;
  createChore(chore: InsertChore): Promise<Chore>;
  updateChore(id: number, chore: Partial<Chore>): Promise<Chore>;
  completeChore(id: number, userId: number): Promise<Chore>;
  
  // Notification methods
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getUnreadNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private households: Map<number, Household>;
  private chores: Map<number, Chore>;
  private notifications: Map<number, Notification>;
  
  private userCurrentId: number;
  private householdCurrentId: number;
  private choreCurrentId: number;
  private notificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.households = new Map();
    this.chores = new Map();
    this.notifications = new Map();
    
    this.userCurrentId = 1;
    this.householdCurrentId = 1;
    this.choreCurrentId = 1;
    this.notificationCurrentId = 1;
    
    // Add some seed data for testing
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getHouseholdUsers(householdId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.householdId === householdId,
    );
  }
  
  async updateUserHousehold(userId: number, householdId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, householdId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Household methods
  async getHousehold(id: number): Promise<Household | undefined> {
    return this.households.get(id);
  }
  
  async createHousehold(insertHousehold: InsertHousehold): Promise<Household> {
    const id = this.householdCurrentId++;
    const household: Household = { ...insertHousehold, id };
    this.households.set(id, household);
    return household;
  }
  
  // Chore methods
  async getChore(id: number): Promise<Chore | undefined> {
    return this.chores.get(id);
  }
  
  async getChoresByHousehold(householdId: number): Promise<Chore[]> {
    return Array.from(this.chores.values()).filter(
      (chore) => chore.householdId === householdId,
    );
  }
  
  async getChoresByUser(userId: number): Promise<Chore[]> {
    return Array.from(this.chores.values()).filter(
      (chore) => chore.assignedToId === userId && !chore.completed,
    );
  }
  
  async getTodaysChores(householdId: number): Promise<Chore[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.chores.values()).filter(chore => {
      if (chore.householdId !== householdId) return false;
      
      const dueDate = new Date(chore.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  }
  
  async getUpcomingChores(householdId: number, days: number): Promise<Chore[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);
    
    return Array.from(this.chores.values()).filter(chore => {
      if (chore.householdId !== householdId || chore.completed) return false;
      
      const dueDate = new Date(chore.dueDate);
      return dueDate > today && dueDate <= endDate;
    });
  }
  
  async getOverdueChores(householdId: number): Promise<Chore[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.chores.values()).filter(chore => {
      if (chore.householdId !== householdId || chore.completed) return false;
      
      const dueDate = new Date(chore.dueDate);
      return dueDate < today;
    });
  }
  
  async createChore(insertChore: InsertChore): Promise<Chore> {
    const id = this.choreCurrentId++;
    const chore: Chore = { 
      ...insertChore, 
      id, 
      completed: false,
      completedAt: null,
      completedById: null
    };
    this.chores.set(id, chore);
    return chore;
  }
  
  async updateChore(id: number, choreUpdate: Partial<Chore>): Promise<Chore> {
    const chore = await this.getChore(id);
    if (!chore) throw new Error("Chore not found");
    
    const updatedChore = { ...chore, ...choreUpdate };
    this.chores.set(id, updatedChore);
    return updatedChore;
  }
  
  async completeChore(id: number, userId: number): Promise<Chore> {
    const chore = await this.getChore(id);
    if (!chore) throw new Error("Chore not found");
    
    const completedAt = new Date();
    const updatedChore = { 
      ...chore, 
      completed: true, 
      completedAt, 
      completedById: userId 
    };
    
    this.chores.set(id, updatedChore);
    
    // If the chore is recurring, create a new instance
    if (chore.repeatFrequency !== "Never") {
      let nextDueDate = new Date(chore.dueDate);
      
      switch (chore.repeatFrequency) {
        case "Daily":
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case "Weekly":
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case "Biweekly":
          nextDueDate.setDate(nextDueDate.getDate() + 14);
          break;
        case "Monthly":
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
      }
      
      await this.createChore({
        name: chore.name,
        description: chore.description,
        category: chore.category,
        estimatedMinutes: chore.estimatedMinutes,
        householdId: chore.householdId,
        assignedToId: chore.assignedToId,
        dueDate: nextDueDate,
        repeatFrequency: chore.repeatFrequency
      });
    }
    
    return updatedChore;
  }
  
  // Notification methods
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUnreadNotificationsByUser(userId: number): Promise<Notification[]> {
    return (await this.getNotificationsByUser(userId)).filter(notification => !notification.read);
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      read: false,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) throw new Error("Notification not found");
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = await this.getNotificationsByUser(userId);
    for (const notification of userNotifications) {
      if (!notification.read) {
        await this.markNotificationAsRead(notification.id);
      }
    }
  }
  
  // Seed data for testing
  private seedData() {
    // Create sample users
    const user1 = this.createUser({
      username: "alexj",
      password: "password123",
      email: "alex@example.com",
      fullName: "Alex Johnson",
      avatarColor: "#4F46E5"
    });
    
    const user2 = this.createUser({
      username: "samlee",
      password: "password123",
      email: "sam@example.com",
      fullName: "Sam Lee",
      avatarColor: "#10B981"
    });
    
    const user3 = this.createUser({
      username: "jordant",
      password: "password123",
      email: "jordan@example.com",
      fullName: "Jordan Taylor",
      avatarColor: "#F59E0B"
    });
    
    const user4 = this.createUser({
      username: "morganp",
      password: "password123",
      email: "morgan@example.com",
      fullName: "Morgan Patel",
      avatarColor: "#EF4444"
    });
    
    // Create a household
    const household = this.createHousehold({
      name: "Treehouse Apt #4",
      createdById: 1
    });
    
    // Update users with household ID
    this.updateUserHousehold(1, 1);
    this.updateUserHousehold(2, 1);
    this.updateUserHousehold(3, 1);
    this.updateUserHousehold(4, 1);
    
    // Create sample chores
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.createChore({
      name: "Clean kitchen counters",
      description: "",
      category: "Kitchen",
      estimatedMinutes: 15,
      householdId: 1,
      assignedToId: 1,
      dueDate: today,
      repeatFrequency: "Daily"
    });
    
    this.createChore({
      name: "Take out trash",
      description: "",
      category: "General",
      estimatedMinutes: 5,
      householdId: 1,
      assignedToId: 2,
      dueDate: today,
      repeatFrequency: "Weekly"
    });
    
    this.createChore({
      name: "Vacuum living room",
      description: "",
      category: "Living Room",
      estimatedMinutes: 20,
      householdId: 1,
      assignedToId: 1,
      dueDate: yesterday,
      repeatFrequency: "Weekly"
    });
    
    this.createChore({
      name: "Clean bathroom",
      description: "",
      category: "Bathroom",
      estimatedMinutes: 30,
      householdId: 1,
      assignedToId: 1,
      dueDate: tomorrow,
      repeatFrequency: "Weekly"
    });
    
    this.createChore({
      name: "Mop kitchen floor",
      description: "",
      category: "Kitchen",
      estimatedMinutes: 20,
      householdId: 1,
      assignedToId: 2,
      dueDate: dayAfterTomorrow,
      repeatFrequency: "Biweekly"
    });
    
    // Mark one chore as completed
    this.completeChore(2, 2);
    
    // Create sample notifications
    this.createNotification({
      userId: 1,
      type: "chore_overdue",
      message: "Vacuum living room is overdue",
      choreId: 3
    });
    
    this.createNotification({
      userId: 1,
      type: "chore_completed",
      message: "Sam completed \"Take out trash\"",
      choreId: 2
    });
    
    this.createNotification({
      userId: 1,
      type: "chore_due_soon",
      message: "Clean bathroom is due tomorrow",
      choreId: 4
    });
  }
}

export const storage = new MemStorage();
