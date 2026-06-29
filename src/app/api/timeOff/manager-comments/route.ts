import { dbConnect } from '@/lib/db';
import LeaveRequest from '@/models/LeaveRequest';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const statusParam = url.searchParams.get('status');

    if (!employeeId) {
      return Response.json({ error: 'employeeId is required' }, { status: 400 });
    }

    const query: Record<string, any> = {
      employeeId,
      comments: { $exists: true, $ne: '' },
    };

    if (statusParam) {
      const statusValues = statusParam
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (statusValues.length > 0) {
        query.status = { $in: statusValues };
      }
    } else {
      query.status = { $in: ['APPROVED', 'REJECTED', 'PENDING'] };
    }

    const comments = await LeaveRequest.find(query, {
      requestId: 1,
      leaveType: 1,
      startDate: 1,
      endDate: 1,
      managerName: 1,
      status: 1,
      comments: 1,
      employeeId: 1,
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return Response.json(comments, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch manager comments:', error);
    return Response.json({ error: 'Failed to fetch manager comments' }, { status: 500 });
  }
}
