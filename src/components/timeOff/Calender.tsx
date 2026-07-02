'use client';

import { FC, useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { Event, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import type { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addHours,
  startOfHour,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Loader } from 'lucide-react';
import { holidays } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Calendar localization setup
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


interface CalendarEvent extends Event {
  id?: string;
  resource?: {
    type: 'leave' | 'wfh' | 'compoff' | 'holiday';
    id?: string;
    [key: string]: any;
  };
}
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

const Calender: FC = () => {
  const { user } = useAuth();
  const employeeId = user?.userId;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('month');

  // Fetch calendar data from all endpoints
  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        const [leaveRes, wfhRes, compoffRes] = await Promise.all([
          fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING,REJECTED`),
          fetch(`/api/timeOff/wfh-request?employeeId=${encodeURIComponent(employeeId)}`),
          fetch(`/api/timeOff/comp-off?employeeId=${encodeURIComponent(employeeId)}`),
        ]);

        let leaveData = [];
        let wfhData = [];
        let compoffData = { data: [] };

        if (leaveRes.ok) {
          leaveData = await leaveRes.json().catch(() => []);
        } else {
          console.error('Failed to fetch leave requests:', leaveRes.status);
        }

        if (wfhRes.ok) {
          wfhData = await wfhRes.json().catch(() => []);
        } else {
          console.error('Failed to fetch WFH requests:', wfhRes.status);
        }

        if (compoffRes.ok) {
          compoffData = await compoffRes.json().catch(() => ({ data: [] }));
        } else {
          console.error('Failed to fetch comp off records:', compoffRes.status);
        }

        // Transform and merge all events
        const allEvents: CalendarEvent[] = [];

        // Process leave requests - ONLY APPROVED
        const leaveList = Array.isArray(leaveData) ? leaveData : (leaveData?.data && Array.isArray(leaveData.data) ? leaveData.data : []);
        leaveList.forEach((item: any) => {
          if (item.status?.toUpperCase() === 'APPROVED') {
            allEvents.push({
              id: item._id || item.id,
              title: `Leave - ${item.leaveType || 'Time Off'}`,
              start: new Date(item.startDate),
              end: new Date(item.endDate),
              resource: {
                type: 'leave',
                id: item._id || item.id,
                leaveType: item.leaveType,
                status: item.status,
              },
            });
          }
        });

        // Process WFH requests - ONLY APPROVED
        const wfhList = Array.isArray(wfhData) ? wfhData : (wfhData?.data && Array.isArray(wfhData.data) ? wfhData.data : []);
        wfhList.forEach((item: any) => {
          if (item.status?.toUpperCase() === 'APPROVED') {
            allEvents.push({
              id: item._id || item.id,
              title: `WFH - Work From Home`,
              start: new Date(item.startDate),
              end: new Date(item.endDate),
              resource: {
                type: 'wfh',
                id: item._id || item.id,
                status: item.status,
              },
            });
          }
        });

        // Process Comp Off - ONLY AVAILABLE
        const compoffList = Array.isArray(compoffData) ? compoffData : (compoffData?.data && Array.isArray(compoffData.data) ? compoffData.data : []);
        compoffList.forEach((item: any) => {
          if (item.status?.toUpperCase() === 'AVAILABLE') {
            const startDate = typeof item.earnedOn === 'string'
              ? new Date(item.earnedOn)
              : item.earnedOn;
            const endDate = typeof item.expiryDate === 'string'
              ? new Date(item.expiryDate)
              : item.expiryDate;

            allEvents.push({
              id: item._id || item.compOffId,
              title: `Comp Off - ${item.workType || 'Compensation'}`,
              start: startDate,
              end: endDate,
              resource: {
                type: 'compoff',
                id: item._id || item.compOffId,
                workType: item.workType,
                status: item.status,
              },
            });
          }
        });

        // Process Holidays from mock data
        if (Array.isArray(holidays)) {
          holidays.forEach((holiday: any) => {
            // Parse date like "26 Jan 2025" to Date object
            const [day, monthStr, year] = holiday.date.split(' ');
            const dateStr = `${day} ${monthStr} ${year}`;
            const holidayDate = parse(dateStr, 'd MMM yyyy', new Date());

            allEvents.push({
              id: holiday.id,
              title: `🏖️ ${holiday.name}`,
              start: holidayDate,
              end: holidayDate,
              resource: {
                type: 'holiday',
                holidayType: holiday.type,
                locations: holiday.locations,
              },
            });
          });
        }
        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  // Event style getter for color coding
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#6366f1'; // indigo (default)

    if (event.resource?.type === 'leave') {
      backgroundColor = '#ef4444'; // red
    } else if (event.resource?.type === 'wfh') {
      backgroundColor = '#3b82f6'; // blue
    } else if (event.resource?.type === 'compoff') {
      backgroundColor = '#10b981'; // green
    } else if (event.resource?.type === 'holiday') {
      backgroundColor = '#f59e0b'; // amber/gold for holidays
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.start && event.end) {
      alert(`${event.title}\n${format(event.start, 'PPP')} - ${format(event.end, 'PPP')}`);
    }
  };

  // Handle event drag and drop
  const onEventDrop: withDragAndDropProps['onEventDrop'] = (data) => {
    console.log('Event dropped:', data);
    // You can implement actual save functionality here
  };

  // Handle event resize
  const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
    console.log('Event resized:', data);
    // You can implement actual save functionality here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg border border-slate-200">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-700">Leave (Approved)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-700">Work From Home (Approved)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-slate-700">Comp Off (Available)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-slate-700">Holidays</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4">
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              view={view}
              onView={setView}
              defaultView="month"
              views={['month', 'week', 'day', 'agenda']}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onEventDrop={onEventDrop}
              onEventResize={onEventResize}
              resizable
              popup
              selectable
            />
          </div>
        </div>

        <style jsx>{`
        :global(.rbc-calendar) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        :global(.rbc-toolbar) {
          padding: 16px 0;
          gap: 8px;
        }

        :global(.rbc-toolbar button) {
          padding: 8px 12px;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        :global(.rbc-toolbar button:hover) {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        :global(.rbc-toolbar button.rbc-active) {
          background-color: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }

        :global(.rbc-header) {
          padding: 12px 4px;
          font-weight: 600;
          color: #334155;
          border-bottom: 2px solid #e2e8f0;
        }

        :global(.rbc-today) {
          background-color: #f0f9ff;
        }

        :global(.rbc-off-range-bg) {
          background-color: #f8fafc;
        }

        :global(.rbc-event) {
          padding: 4px 6px;
        }

        :global(.rbc-event-label) {
          font-size: 12px;
        }

        :global(.rbc-event-content) {
          font-size: 13px;
          font-weight: 500;
        }

        :global(.rbc-agenda-view) {
          border: none;
        }

        :global(.rbc-agenda-view table.rbc-agenda-table) {
          border-collapse: collapse;
        }

        :global(.rbc-agenda-view table.rbc-agenda-table tbody > tr > td) {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        :global(.rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td) {
          border-left: 1px solid #e2e8f0;
        }

        :global(.rbc-agenda-date-cell) {
          white-space: nowrap;
        }

        :global(.rbc-agenda-time-cell) {
          white-space: nowrap;
        }

        :global(.rbc-time-slot) {
          border-top: 1px solid #e2e8f0;
        }

        :global(.rbc-current-time-indicator) {
          background-color: #ef4444;
          height: 2px;
        }

        :global(.rbc-timeslot-group) {
          border-left: 1px solid #e2e8f0;
          min-height: 60px;
        }
      `}</style>
      </div>
    </>
  );
}

export default Calender;
