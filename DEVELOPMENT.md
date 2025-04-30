# ChoreSync Development Guide

This document provides detailed instructions for developers working on the ChoreSync application, with specific focus on development within the Replit environment.

## Project Structure

```
/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and helpers
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   └── index.html           # HTML template
├── server/                  # Backend Express server
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Storage implementation
│   └── vite.ts              # Vite server configuration
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema and type definitions
└── package.json             # Project dependencies and scripts
```

## Getting Started in Replit

1. **Fork the Project**: 
   - Click the "Fork" button to create your own copy of the repository

2. **Start the Application**:
   - The application is configured to run with the "Start application" workflow
   - This will automatically start both the backend server and frontend development server

3. **Accessing the Application**:
   - The application will be available at the URL shown in the preview window
   - If you need the direct URL, you can find it in the "Webview" tab

## Development Workflow

### Adding New Features

1. **Update Schema** (if needed):
   - Modify `shared/schema.ts` to define any new data models
   - Define proper types and insert schemas for new entities

2. **Update Storage Implementation**:
   - Add necessary methods to `server/storage.ts` to handle data operations
   - Implement CRUD operations for new entities

3. **Add API Routes**:
   - Create new routes in `server/routes.ts` to expose functionality
   - Ensure proper validation and error handling

4. **Implement UI Components**:
   - Add or modify components in `client/src/components/`
   - Create necessary hooks for data fetching and state management

5. **Add Pages** (if needed):
   - Create new page components in `client/src/pages/`
   - Update routing in `client/src/App.tsx`

### Best Practices

1. **Type Safety**:
   - Always use proper TypeScript types
   - Leverage shared schema types for consistency

2. **Data Fetching**:
   - Use TanStack Query for all data fetching operations
   - Follow the pattern in existing hooks for consistency

3. **State Management**:
   - Use React Query for server state
   - Use React Context for shared application state
   - Use local component state for UI-specific state

4. **WebSocket Communication**:
   - Use the socket context for real-time communication
   - Dispatch custom events to trigger data refetching

## Testing Changes

1. **Manual Testing**:
   - Use the browser preview to test UI changes
   - Test all user flows thoroughly
   - Verify that real-time updates work correctly

2. **Error Handling**:
   - Check browser console for any errors
   - Verify server logs for backend issues

## Debugging

1. **Frontend Debugging**:
   - Use browser developer tools
   - Check React DevTools for component state
   - Add console.log statements for specific issues

2. **Backend Debugging**:
   - Check server logs in the Replit console
   - Add debug logging to troubleshoot specific issues

## Deployment

The application can be deployed directly from Replit:

1. Click the "Deploy" button in the Replit interface
2. Follow the prompts to configure your deployment
3. Once deployed, the application will be available at the provided URL

## Common Issues and Solutions

### WebSocket Connection Issues

If real-time updates aren't working:
- Verify WebSocket server is running
- Check client-side connection in browser console
- Ensure proper WebSocket URL configuration

### Authentication Problems

If login/registration isn't working:
- Check server authentication routes
- Verify session configuration
- Clear browser cookies and try again

### Data Not Refreshing

If data doesn't update after changes:
- Check query invalidation in mutation handlers
- Verify WebSocket event dispatching
- Ensure components are subscribed to the right queries