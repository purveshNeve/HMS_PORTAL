'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TeamMember {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  joiningDate?: string | null;
  profileImage?: string | null;
}

function formatDate(value?: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRole(role?: string) {
  if (!role) return 'Employee';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export default function TeamMembers() {
  const { userId } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [profileRes, usersRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/auth/allUsers'),
        ]);

        if (!profileRes.ok || !usersRes.ok) {
          throw new Error('Unable to load team details');
        }

        const profile = await profileRes.json();
        const users = (await usersRes.json()) as TeamMember[];

        const sameDepartment = users.filter((user) => {
          if (user.userId === userId) return false;
          return user.department && profile?.department && user.department === profile.department;
        });
        setMembers(sameDepartment);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load team members');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [userId]);

  const teamTitle = useMemo(() => {
    return members.length > 0 ? 'Meet your team' : 'No teammates found';
  }, [members.length]);

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{teamTitle}</h1>
        <p className="text-sm text-slate-500">People from your department</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading team members...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
          No team members found for your department.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <div key={member.userId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {member.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0].toUpperCase())
                      .join('')}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-slate-800">{member.name}</h2>
                  <p className="text-sm text-slate-500">{formatRole(member.role)}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">DOJ:</span> {formatDate(member.joiningDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}