import { dbConnect } from '@/lib/db';
import LeaveRequest from '@/models/LeaveRequest';
import User from '@/models/User';

export async function PATCH(req: Request, context: { params: Promise<{ requestId?: string }> | { requestId?: string } }) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const resolvedParams = await Promise.resolve(context.params);
    const { managerId, status, comment, comments, requestId: bodyRequestId } = body;
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : undefined;
    const normalizedComment = typeof comment === 'string' ? comment : typeof comments === 'string' ? comments : undefined;
    const requestId = resolvedParams?.requestId || bodyRequestId;

    if (!requestId) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }
    if (!managerId) {
      return Response.json({ error: 'managerId is required' }, { status: 400 });
    }
    if (!normalizedStatus && (normalizedComment === undefined || normalizedComment === null || String(normalizedComment).trim() === '')) {
      return Response.json({ error: 'A non-empty comment is required' }, { status: 400 });
    }

    const manager = await User.findOne({ userId: managerId, role: 'MANAGER' });
    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }

    const leaveRequest = await LeaveRequest.findOne({ requestId });
    if (!leaveRequest) {
      return Response.json({ error: 'Leave request not found' }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (normalizedStatus) {
      if (leaveRequest.status !== 'PENDING') {
        return Response.json({ error: 'Only pending requests can be updated' }, { status: 400 });
      }
      if (normalizedStatus !== 'APPROVED' && normalizedStatus !== 'REJECTED') {
        return Response.json({ error: 'Invalid status update' }, { status: 400 });
      }
      updatePayload.status = normalizedStatus;
    }

    if (normalizedComment !== undefined && normalizedComment !== null) {
      const trimmedComment = String(normalizedComment).trim();
      if (!trimmedComment) {
        return Response.json({ error: 'A non-empty comment is required' }, { status: 400 });
      }
      updatePayload.comments = trimmedComment;
    }

    const updatedLeaveRequest = await LeaveRequest.findOneAndUpdate(
      { requestId },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedLeaveRequest) {
      return Response.json({ error: 'Leave request could not be updated' }, { status: 500 });
    }

    console.log('Leave request updated successfully', { requestId, status: updatedLeaveRequest.status, comments: updatedLeaveRequest.comments });
    return Response.json({ success: true, requestId: updatedLeaveRequest.requestId, status: updatedLeaveRequest.status, comments: updatedLeaveRequest.comments }, { status: 200 });
  } catch (error) {
    console.error('Failed to update leave request:', error);
    return Response.json({ error: 'Failed to update leave request' }, { status: 500 });
  }
}
