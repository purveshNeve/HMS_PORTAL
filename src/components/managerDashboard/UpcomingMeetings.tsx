"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface MeetingDisplayItem {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  note: string;
  attendees: string[];
}

interface TeamMember {
  userId: string;
  name: string;
  role?: string;
}

function MeetingList({
  meetings,
  teamMembers,
}: {
  meetings: MeetingDisplayItem[];
  teamMembers: TeamMember[];
}) {
  if (meetings.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No meetings scheduled.</p>;
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="space-y-3 rounded-xl border border-slate-100 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">{meeting.title}</p>
              <p className="text-xs text-slate-500">
                {meeting.date} · {meeting.time} · {meeting.duration}
              </p>
            </div>
            <Button size="sm" variant="secondary" className="shrink-0 gap-1.5 rounded-lg">
              <Video className="h-3.5 w-3.5" />
              Join
            </Button>
          </div>
          {meeting.note ? <p className="text-sm text-slate-600">{meeting.note}</p> : null}
          <div className="flex flex-wrap gap-2">
            {meeting.attendees.map((attendee) => (
              <span
                key={attendee}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {attendee === "all"
                  ? "All"
                  : teamMembers.find((member) => member.userId === attendee)?.name ?? attendee}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function UpcomingMeetings() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [meetings, setMeetings] = useState<MeetingDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings");
        if (!response.ok) {
          throw new Error("Failed to load meetings");
        }
        const data = await response.json();
        if (!isMounted) return;

        setMeetings(
          data.meetings.map((meeting: any) => ({
            id: meeting._id ?? meeting.id,
            title: meeting.title,
            date: new Date(meeting.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: meeting.time,
            duration: meeting.duration,
            note: meeting.note || "",
            attendees: meeting.attendees ?? [],
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMeetings();

    async function loadTeamMembers() {
      try {
        const response = await fetch("/api/myTeamDetail");
        if (!response.ok) {
          throw new Error("Failed to load team members");
        }
        const data = await response.json();
        setTeamMembers(data.teamMembers ?? []);
      } catch (error) {
        console.error(error);
      }
    }

    loadTeamMembers();
    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setDuration("");
    setNotes("");
    setAttendees([]);
  };

  const handleAttendeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    if (selectedValues.includes("all")) {
      setAttendees(["all"]);
    } else {
      setAttendees(selectedValues);
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          time,
          duration,
          note: notes,
          attendees,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "Failed to schedule meeting");
      }

      const data = await response.json();
      const meeting = data.meeting;
      setMeetings((current) => [
        {
          id: meeting._id ?? meeting.id,
          title: meeting.title,
          date: new Date(meeting.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: meeting.time,
          duration: meeting.duration,
          note: meeting.note || "",
          attendees: meeting.attendees ?? [],
        },
        ...meetings,
      ]);

      resetForm();
      setScheduleOpen(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to schedule meeting");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-800">Upcoming Meetings</CardTitle>
            <p className="text-sm text-slate-500">Saved meetings are loaded from the server.</p>
          </div>
          <Button size="sm" onClick={() => setScheduleOpen(true)}>
            Schedule Meeting
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading meetings...</p>
          ) : (
            <MeetingList meetings={meetings} teamMembers={teamMembers} />
          )}
        </CardContent>
      </Card>

      <Drawer
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule Meeting"
        description="Create a new team meeting with attendees and schedule details"
      >
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            handleScheduleSubmit();
          }}
        >
          <div className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="Meeting title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
              <Input
                label="Time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </div>
            <Input
              label="Duration"
              type="text"
              placeholder="e.g. 30 mins"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              required
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="meeting-notes" className="text-sm font-medium text-zinc-700">
                Note
              </label>
              <textarea
                id="meeting-notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add notes or agenda details"
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="meeting-attendees" className="text-sm font-medium text-zinc-700">
                Attendees
              </label>
              <select
                id="meeting-attendees"
                multiple
                value={attendees}
                onChange={handleAttendeeChange}
                className="h-40 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              >
                <option value="all">All</option>
                {teamMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.name} — {member.role}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                Hold Ctrl/Cmd to select multiple attendees. Select All to invite every team member.
              </p>
            </div>
          </div>

          <div className="mt-auto flex gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="secondary" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Drawer>
    </motion.div>
  );
}
