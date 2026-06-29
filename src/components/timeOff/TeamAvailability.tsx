'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

interface BackendLeaveRequest {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  isHalfDay?: boolean;
  status: string;
}

interface EmployeeUser {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  department?: string;
}

interface TeamMemberView extends EmployeeUser {
  initials: string;
  color: string;
  presence: 'available' | 'wfh' | 'onLeave';
  leaveType?: string;
  leaveUntil?: string;
}

const avatarColors = [
  '#4f46e5',
  '#0f766e',
  '#c2410c',
  '#15803d',
  '#7c3aed',
  '#0ea5e9',
  '#14b8a6',
  '#f97316',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function getAvatarColor(id: string) {
  const index = id
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
}

function toDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}

function isDateInRange(date: Date, start: Date, end: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const rangeStart = new Date(start);
  const rangeEnd = new Date(end);
  rangeStart.setHours(0, 0, 0, 0);
  rangeEnd.setHours(0, 0, 0, 0);
  return day >= rangeStart && day <= rangeEnd;
}

function formatDate(value: string | Date) {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TeamAvailability() {
  const { userId } = useAuth();
  const [team, setTeam] = useState<TeamMemberView[]>([]);
  const [teamLabel, setTeamLabel] = useState('Your team');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeamAvailability = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const [profileRes, usersRes, leaveRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/auth/allUsers'),
        fetch('/api/timeOff/leave-requests?status=APPROVED'),
      ]);

      if (!profileRes.ok) {
        throw new Error('Unable to load user profile');
      }
      if (!usersRes.ok) {
        throw new Error('Unable to load team members');
      }
      if (!leaveRes.ok) {
        throw new Error('Unable to load leave requests');
      }

      const profile = await profileRes.json();
      const users = (await usersRes.json()) as EmployeeUser[];
      const leaveRequests = (await leaveRes.json()) as BackendLeaveRequest[];

      const teamMembers = users.filter((user) => {
        if (user.userId === userId) {
          return true;
        }
        if (profile?.department) {
          return user.department === profile.department;
        }
        return true;
      });

      const today = new Date();
      const statusMap: Record<
        string,
        { presence: 'wfh' | 'onLeave'; leaveType: string; leaveUntil: string; endDate: Date }
      > = {};

      leaveRequests.forEach((request) => {
        const start = toDate(request.startDate);
        const end = toDate(request.endDate);
        if (!start || !end) return;
        if (!isDateInRange(today, start, end)) return;

        const existing = statusMap[request.employeeId];
        const presence = request.leaveType === 'Work From Home' ? 'wfh' : 'onLeave';
        const leaveUntil = formatDate(end);

        if (!existing || end > existing.endDate || (existing.presence === 'onLeave' && presence === 'wfh')) {
          statusMap[request.employeeId] = { presence, leaveType: request.leaveType, leaveUntil, endDate: end };
        }
      });

      const members = teamMembers.map((member) => {
        const status = statusMap[member.userId];
        return {
          ...member,
          initials: getInitials(member.name),
          color: getAvatarColor(member.userId),
          presence: status?.presence ?? 'available',
          leaveType: status?.leaveType,
          leaveUntil: status?.leaveUntil,
        };
      });

      setTeamLabel(profile?.department ? profile.department : 'Your team');
      setTeam(members);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team availability');
      setTeam([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTeamAvailability();

    const handleRefresh = () => fetchTeamAvailability();
    window.addEventListener('leave-request-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener('leave-request-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [fetchTeamAvailability]);

  const counts = useMemo(() => {
    const onLeaveToday = team.filter((member) => member.presence === 'onLeave');
    const wfhToday = team.filter((member) => member.presence === 'wfh');
    const inOffice = team.filter((member) => member.presence === 'available');
    const availPct = team.length ? Math.round((inOffice.length / team.length) * 100) : 0;

    return {
      onLeaveToday,
      wfhToday,
      inOffice,
      availPct,
    };
  }, [team]);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Team Availability</h2>
          <p className="section-subtitle">
            {teamLabel} · Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-800">{counts.availPct}%</p>
          <p className="text-2xs text-slate-400">dept. available</p>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-slate-100">
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          <div className="bg-emerald-400 transition-all" style={{ width: `${(counts.inOffice.length / Math.max(team.length, 1)) * 100}%` }} />
          <div className="bg-amber-400 transition-all" style={{ width: `${(counts.wfhToday.length / Math.max(team.length, 1)) * 100}%` }} />
          <div className="bg-red-300 transition-all" style={{ width: `${(counts.onLeaveToday.length / Math.max(team.length, 1)) * 100}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          {[
            { color: 'bg-emerald-400', label: 'In Office', count: counts.inOffice.length },
            { color: 'bg-amber-400', label: 'WFH', count: counts.wfhToday.length },
            { color: 'bg-red-300', label: 'On Leave', count: counts.onLeaveToday.length },
          ].map(({ color, label, count }) => (
            <div key={label} className="flex items-center gap-1">
              <span className={clsx('w-2 h-2 rounded-sm', color)} />
              <span className="text-2xs text-slate-500">{label}</span>
              <span className="text-2xs font-semibold text-slate-700 ml-0.5">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">Loading team availability…</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : team.length === 0 ? (
          <div className="p-4 text-center text-slate-500">No team data available</div>
        ) : (
          team.map((member) => (
            <div key={member.userId} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-25 transition-colors">
              <div className="relative shrink-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-2xs font-semibold"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <span
                  className={clsx(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                    member.presence === 'available'
                      ? 'bg-emerald-500'
                      : member.presence === 'wfh'
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{member.name}</p>
                <p className="text-2xs text-slate-400 truncate">
                  {member.designation || member.department || member.role}
                </p>
              </div>

              <div className="text-right shrink-0">
                {member.presence === 'available' ? (
                  <span className="badge badge-green">Available</span>
                ) : (
                  <>
                    <span className={clsx('badge text-2xs', member.presence === 'wfh' ? 'badge-yellow' : 'badge-red')}>
                      {member.presence === 'wfh' ? 'WFH' : 'On Leave'}
                    </span>
                    {member.leaveUntil && (
                      <p className="text-2xs text-slate-400 mt-0.5">Until {member.leaveUntil}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <button className="text-2xs text-brand-600 hover:underline">View full team →</button>
      </div>
    </div>
  );
}
