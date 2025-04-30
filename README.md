# ChoreSync - Household Chore Management Application

ChoreSync is a full-stack web application designed to help apartment renters and roommates manage and coordinate household chores efficiently. With real-time updates and cross-device synchronization, everyone stays on the same page.

## Features

- **User Authentication**: Secure login and registration system
- **Household Management**: Create and join households with your roommates
- **Chore Assignment**: Assign chores to specific household members
- **Scheduling**: Set due dates and recurring schedules for chores
- **Real-time Updates**: See changes instantly with WebSocket integration
- **Notifications**: Get reminded about upcoming and overdue chores
- **Statistics**: Track chore completion history and household contribution
- **Calendar View**: Visualize all chores in a calendar format

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn/UI components
- **Backend**: Node.js with Express
- **State Management**: TanStack Query (React Query)
- **Real-time Communication**: WebSockets
- **Storage**: In-memory storage with option for PostgreSQL database

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/choresync.git
   cd choresync
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage Guide

1. **Registration**: Create a new account with your email, username, and password
2. **Create a Household**: Set up a new household or join an existing one
3. **Add Chores**: Create tasks with descriptions, due dates, and assigned members
4. **Track Progress**: Mark chores as complete when finished
5. **Check Statistics**: View household participation metrics
6. **Manage Notifications**: Stay informed about upcoming responsibilities

## Development

The application structure follows a modern full-stack architecture:

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared types and schemas

To start the application in development mode:

```
npm run dev
```

This will start both the backend server and the frontend development server concurrently.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Shadcn UI components
- Uses TanStack Query for efficient data fetching
- WebSocket integration for real-time updates