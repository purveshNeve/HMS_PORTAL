import { dbConnect } from '@/lib/db';
import LeaveRequest from '@/models/LeaveRequest';
import User from '@/models/User';

export async function PATCH(req: Request, { params }: { params: { requestId: string } }) {
  try {
    await dbConnect();
    const { managerId, status, requestId: bodyRequestId } = await req.json();
    const requestId = params.requestId || bodyRequestId;

    if (!requestId) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }
    if (!managerId || !status) {
      return Response.json({ error: 'managerId and status are required' }, { status: 400 });
    }

    const manager = await User.findOne({ userId: managerId, role: 'MANAGER' });
    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }

    const leaveRequest = await LeaveRequest.findOne({ requestId, managerId });
    if (!leaveRequest) {
      return Response.json({ error: 'Leave request not found' }, { status: 404 });
    }
    if (leaveRequest.status !== 'PENDING') {
      return Response.json({ error: 'Only pending requests can be updated' }, { status: 400 });
    }

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return Response.json({ error: 'Invalid status update' }, { status: 400 });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    // No websocket notifications are used; the frontend fetches updated leave requests.
    return Response.json({ success: true, requestId: leaveRequest.requestId, status: leaveRequest.status }, { status: 200 });
  } catch (error) {
    console.error('Failed to update leave request:', error);
    return Response.json({ error: 'Failed to update leave request' }, { status: 500 });
  }
}
