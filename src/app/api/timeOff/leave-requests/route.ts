import { dbConnect } from '@/lib/db';
import LeaveRequest from '@/models/LeaveRequest';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const managerId = url.searchParams.get('managerId');
    const employeeId = url.searchParams.get('employeeId');
    const statusParam = url.searchParams.get('status');
    if (!managerId && !employeeId) {
      return Response.json({ error: 'managerId or employeeId is required' }, { status: 400 });
    }
    let statusValues: string[] | undefined;
    if (statusParam) {
      statusValues = statusParam.split(',').map(status => status.trim()).filter(Boolean);
    } else if (managerId) {
      statusValues = ['PENDING'];
    } else if (employeeId) {
      statusValues = ['APPROVED', 'PENDING'];
    }
    const query: Record<string, any> = {};
    if (managerId) query.managerId = managerId;
    if (employeeId) query.employeeId = employeeId;
    if (statusValues?.length) query.status = { $in: statusValues };
    const leaveRequests = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return Response.json(leaveRequests, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
    return Response.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}
