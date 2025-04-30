# ChoreSync API Documentation

This document provides details on all available API endpoints in the ChoreSync application.

## Authentication Endpoints

### Register a New User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "email": "string",
  "avatarColor": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "avatarColor": "string",
    "householdId": "number|null"
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Invalid request body
- `409`: Username or email already exists

### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "avatarColor": "string",
    "householdId": "number|null"
  }
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Invalid request body
- `401`: Invalid credentials

### Get Current User

**GET** `/api/auth/me`

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "avatarColor": "string",
    "householdId": "number|null"
  }
}
```

**Status Codes:**
- `200`: User retrieved successfully
- `401`: Not authenticated

### Logout

**POST** `/api/auth/logout`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200`: Logout successful

## Household Endpoints

### Create Household

**POST** `/api/households`

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "household": {
    "id": "number",
    "name": "string",
    "description": "string",
    "createdById": "number"
  }
}
```

**Status Codes:**
- `201`: Household created successfully
- `400`: Invalid request body
- `401`: Not authenticated

### Get Current Household

**GET** `/api/households/current`

**Response:**
```json
{
  "household": {
    "id": "number",
    "name": "string",
    "description": "string",
    "createdById": "number"
  },
  "members": [
    {
      "id": "number",
      "username": "string",
      "fullName": "string",
      "email": "string",
      "avatarColor": "string"
    }
  ]
}
```

**Status Codes:**
- `200`: Household retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

## Chore Endpoints

### Get All Chores

**GET** `/api/chores`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "category": "string",
    "dueDate": "string",
    "completedDate": "string|null",
    "completedById": "number|null",
    "assignedToId": "number",
    "householdId": "number",
    "createdById": "number",
    "frequency": "string|null",
    "points": "number"
  }
]
```

**Status Codes:**
- `200`: Chores retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

### Get Today's Chores

**GET** `/api/chores/today`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "category": "string",
    "dueDate": "string",
    "completedDate": "string|null",
    "completedById": "number|null",
    "assignedToId": "number",
    "householdId": "number",
    "createdById": "number",
    "frequency": "string|null",
    "points": "number"
  }
]
```

**Status Codes:**
- `200`: Chores retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

### Get Upcoming Chores

**GET** `/api/chores/upcoming`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "category": "string",
    "dueDate": "string",
    "completedDate": "string|null",
    "completedById": "number|null",
    "assignedToId": "number",
    "householdId": "number",
    "createdById": "number",
    "frequency": "string|null",
    "points": "number"
  }
]
```

**Status Codes:**
- `200`: Chores retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

### Get Overdue Chores

**GET** `/api/chores/overdue`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "category": "string",
    "dueDate": "string",
    "completedDate": "string|null",
    "completedById": "number|null",
    "assignedToId": "number",
    "householdId": "number",
    "createdById": "number",
    "frequency": "string|null",
    "points": "number"
  }
]
```

**Status Codes:**
- `200`: Chores retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

### Get My Chores

**GET** `/api/chores/my`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "category": "string",
    "dueDate": "string",
    "completedDate": "string|null",
    "completedById": "number|null",
    "assignedToId": "number",
    "householdId": "number",
    "createdById": "number",
    "frequency": "string|null",
    "points": "number"
  }
]
```

**Status Codes:**
- `200`: Chores retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

### Create Chore

**POST** `/api/chores`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "dueDate": "string",
  "assignedToId": "number",
  "frequency": "string|null",
  "points": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "category": "string",
  "dueDate": "string",
  "completedDate": "string|null",
  "completedById": "number|null",
  "assignedToId": "number",
  "householdId": "number",
  "createdById": "number",
  "frequency": "string|null",
  "points": "number"
}
```

**Status Codes:**
- `201`: Chore created successfully
- `400`: Invalid request body or user not in a household
- `401`: Not authenticated

### Update Chore

**PATCH** `/api/chores/:id`

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "dueDate": "string",
  "assignedToId": "number",
  "frequency": "string",
  "points": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "category": "string",
  "dueDate": "string",
  "completedDate": "string|null",
  "completedById": "number|null",
  "assignedToId": "number",
  "householdId": "number",
  "createdById": "number",
  "frequency": "string|null",
  "points": "number"
}
```

**Status Codes:**
- `200`: Chore updated successfully
- `400`: Invalid request body
- `401`: Not authenticated
- `404`: Chore not found

### Complete Chore

**POST** `/api/chores/:id/complete`

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "category": "string",
  "dueDate": "string",
  "completedDate": "string",
  "completedById": "number",
  "assignedToId": "number",
  "householdId": "number",
  "createdById": "number",
  "frequency": "string|null",
  "points": "number"
}
```

**Status Codes:**
- `200`: Chore marked as complete successfully
- `401`: Not authenticated
- `404`: Chore not found

### Delete Chore

**DELETE** `/api/chores/:id`

**Response:**
```json
{
  "message": "Chore deleted successfully"
}
```

**Status Codes:**
- `200`: Chore deleted successfully
- `401`: Not authenticated
- `404`: Chore not found

## Notification Endpoints

### Get All Notifications

**GET** `/api/notifications`

**Response:**
```json
[
  {
    "id": "number",
    "userId": "number",
    "message": "string",
    "type": "string",
    "read": "boolean",
    "createdAt": "string",
    "relatedId": "number|null"
  }
]
```

**Status Codes:**
- `200`: Notifications retrieved successfully
- `401`: Not authenticated

### Get Unread Notifications

**GET** `/api/notifications/unread`

**Response:**
```json
[
  {
    "id": "number",
    "userId": "number",
    "message": "string",
    "type": "string",
    "read": "boolean",
    "createdAt": "string",
    "relatedId": "number|null"
  }
]
```

**Status Codes:**
- `200`: Notifications retrieved successfully
- `401`: Not authenticated

### Mark Notification as Read

**POST** `/api/notifications/:id/read`

**Response:**
```json
{
  "id": "number",
  "userId": "number",
  "message": "string",
  "type": "string",
  "read": "boolean",
  "createdAt": "string",
  "relatedId": "number|null"
}
```

**Status Codes:**
- `200`: Notification marked as read successfully
- `401`: Not authenticated
- `404`: Notification not found

### Mark All Notifications as Read

**POST** `/api/notifications/read-all`

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

**Status Codes:**
- `200`: All notifications marked as read successfully
- `401`: Not authenticated

## Statistics Endpoints

### Get Dashboard Statistics

**GET** `/api/stats/dashboard`

**Response:**
```json
{
  "choreCompletionRate": "number",
  "choresByCategory": [
    {
      "category": "string",
      "count": "number"
    }
  ],
  "choresByAssignee": [
    {
      "assigneeId": "number",
      "assigneeName": "string",
      "count": "number"
    }
  ],
  "upcomingChoreCount": "number",
  "overdueChoreCount": "number",
  "todayChoreCount": "number"
}
```

**Status Codes:**
- `200`: Statistics retrieved successfully
- `400`: User not in a household
- `401`: Not authenticated

## WebSocket Events

The application also supports real-time updates through WebSocket connections.

### Connection

Connect to the WebSocket server at `/ws?userId={userId}` with your user ID as a query parameter.

### Event Types

The server sends the following event types:

- `chore_created`: When a new chore is created
- `chore_updated`: When a chore is updated
- `chore_completed`: When a chore is marked as complete
- `new_notification`: When a new notification is created

### Event Format

```json
{
  "type": "string",
  "data": "object"
}
```

The `data` field contains the relevant data for each event type.

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error message description"
}
```

Common error status codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Unexpected server error