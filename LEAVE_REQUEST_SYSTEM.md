# Leave Request System with WebSocket Implementation

## Overview
This document describes the websocket-based leave request submission system that allows employees to submit leave requests to their managers. The system uses websockets for real-time communication and falls back to HTTP API if websockets are unavailable.

## Architecture

### Components

#### 1. **Frontend (LeaveRequestForm.tsx)**
- Located in: `src/components/timeOff/LeaveRequestForm.tsx`
- Handles the leave request form UI
- Manages form state including:
  - Leave type, start date, end date
  - Manager ID and Manager Name (new fields)
  - Reason, emergency contact, delegate
  - Half day option with session selection
- Submits requests via websocket with HTTP fallback

#### 2. **WebSocket Client (websocket.ts)**
- Located in: `src/lib/websocket.ts`
- Initializes socket.io client connection
- Provides `emitLeaveRequest()` function that:
  - Tries websocket if available and connected
  - Falls back to HTTP POST API
  - Handles timeouts and errors
- Exports initialization and disconnection functions

#### 3. **Leave Request Model (LeaveRequest.ts)**
- Located in: `src/models/LeaveRequest.ts`
- MongoDB schema for storing leave requests
- Fields include:
  - Request ID, Employee ID/Name
  - Manager ID/Name
  - Leave details (type, dates, half-day info)
  - Reason and supporting documents
  - Status (PENDING, APPROVED, REJECTED, CANCELLED)
  - Timestamps

#### 4. **API Endpoint (route.ts)**
- Located in: `src/app/api/timeOff/leave-request/route.ts`
- Handles POST requests for leave submission
- Validates manager ID against database
- Creates leave request record
- Can be extended for email notifications

#### 5. **WebSocket Server (websocketServer.ts)**
- Located in: `src/lib/websocketServer.ts`
- Initializes socket.io server (for custom server setup)
- Handles `leaveRequest:submit` events
- Validates request data
- Saves to database
- Broadcasts notifications to connected managers

## Flow Diagram

```
Employee Form Submission
    ↓
    → Manager ID & Name entered
    → Form validated
    ↓
WebSocket/HTTP Request
    ↓
    → Try WebSocket → If connected, emit leaveRequest:submit
    → If not connected → Use HTTP POST to /api/timeOff/leave-request
    ↓
Backend Processing
    ↓
    → Find manager by ID in database
    → Validate manager exists
    → Create LeaveRequest record
    → Generate Request ID (LR-YYYY-XXXX)
    → Emit notification to connected managers
    ↓
Success Response
    ↓
    → Display confirmation with Request ID
    → Show manager details
```

## Key Features

### 1. **Manager Validation**
- Manager ID must be entered by employee
- System looks up manager in database by userId
- Verifies manager exists and has MANAGER role
- Displays manager name in confirmation

### 2. **Real-time Notifications**
- WebSocket enables real-time push of notifications to managers
- Includes: Request ID, Employee name, Leave type, Dates, Reason

### 3. **Fallback Mechanism**
- Primary: WebSocket (socket.io)
- Secondary: HTTP POST API
- Ensures reliability even if websockets are unavailable

### 4. **Data Validation**
- All required fields must be filled:
  - Leave Type
  - Start Date & End Date
  - Reason
  - Manager ID & Manager Name
- Form disables submit button until all required fields are populated

### 5. **Error Handling**
- Manager not found: Clear error message
- Network timeout: 30-second timeout with user notification
- Validation errors: Display specific error messages

## Required Fields in Leave Request

### From Employee
- **Leave Type**: Selected from predefined options
- **Start Date**: Must be before or equal to end date
- **End Date**: Must be after or equal to start date
- **Reason**: Text describing reason for leave
- **Manager ID**: Database ID of the manager (required)
- **Manager Name**: Name of the manager (required)

### Optional Fields
- **Half Day**: Boolean flag for half-day requests
- **Session**: Morning or Afternoon (if half day)
- **Emergency Contact**: Contact info during leave
- **Delegate**: Team member to handle responsibilities
- **Supporting Document**: File attachment

## Usage

### For Employees

1. Navigate to the leave request page
2. Fill in leave details
3. **Enter Manager ID** (e.g., user ID from database)
4. **Enter Manager Name** (exact name for verification)
5. Click "Submit Request"
6. Receive confirmation with Reference ID

### For Developers - Setting Up WebSocket Server

In your custom Next.js server (if using):

```typescript
import { initializeWebSocketServer } from '@/lib/websocketServer';

// In your server.js or similar
const server = createServer(app);
initializeWebSocketServer(server);
```

### For Developers - Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema

### LeaveRequest Collection
```typescript
{
  requestId: String (unique),
  employeeId: String,
  employeeName: String,
  managerId: String (required),
  managerName: String (required),
  leaveType: String,
  startDate: Date,
  endDate: Date,
  isHalfDay: Boolean,
  session: String (Morning/Afternoon),
  reason: String,
  emergencyContact: String,
  delegate: String,
  status: String (PENDING/APPROVED/REJECTED/CANCELLED),
  notifyManager: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection (Manager lookup)
```typescript
{
  userId: String (unique),
  name: String,
  email: String,
  role: String (EMPLOYEE/MANAGER/ADMIN),
  // ... other fields
}
```

## Future Enhancements

1. **Email Notifications**: Integrate with mail service to send notifications to manager
2. **Authentication**: Get employee ID from session/auth context
3. **Real-time Manager Dashboard**: WebSocket updates for manager's incoming requests
4. **Approval Workflow**: Managers can approve/reject via websocket
5. **Document Storage**: Upload and store supporting documents
6. **Audit Trail**: Track all changes to leave requests
7. **Leave Balance Calculation**: Integrate with payroll system

## Troubleshooting

### Leave Request Not Submitting
1. Check Manager ID exists in database
2. Verify Manager role is "MANAGER"
3. Check network connectivity
4. Review browser console for error messages

### WebSocket Connection Issues
1. Verify socket.io is installed: `npm list socket.io`
2. Check CORS settings if using custom server
3. Fallback to HTTP API should work automatically

### Database Errors
1. Verify MongoDB connection string in `.env.local`
2. Ensure LeaveRequest model is properly registered
3. Check User collection has manager records with correct roles

## Testing

### Manual Testing Steps
1. Create a test manager in database with userId and role="MANAGER"
2. Fill leave form with all required fields
3. Enter the test manager's ID
4. Submit and verify:
   - Request record created in database
   - Reference ID displayed
   - Success message shown

### Sample Manager Record
```json
{
  "userId": "MGR001",
  "name": "Anita Sharma",
  "email": "anita.sharma@company.com",
  "role": "MANAGER"
}
```

## API Endpoint Reference

### POST /api/timeOff/leave-request

**Request Body:**
```json
{
  "managerId": "MGR001",
  "managerName": "Anita Sharma",
  "reason": "Personal work",
  "startDate": "2025-07-01",
  "endDate": "2025-07-03",
  "leaveType": "Annual Leave",
  "isHalfDay": false,
  "session": "",
  "emergencyContact": "John Doe: 9876543210",
  "delegate": "Priya Nair",
  "notifyManager": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "requestId": "LR-2025-0042",
  "message": "Leave request submitted to Anita Sharma",
  "manager": {
    "id": "MGR001",
    "name": "Anita Sharma",
    "email": "anita.sharma@company.com"
  }
}
```

**Error Response (400/404/500):**
```json
{
  "error": "Manager not found or invalid manager ID"
}
```
