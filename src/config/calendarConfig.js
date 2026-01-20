import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { sv, enUS } from 'date-fns/locale';

const locales = {
  'sv-SE': sv,
  'en-US': enUS,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Default calendar configuration settings
export const calendarDefaults = {
  defaultView: 'week',
  views: ['month', 'week', 'day', 'agenda'],
  step: 30, // 30 minute intervals
  timeslots: 1,
  min: new Date(0, 0, 0, 8, 0, 0), // 8 AM
  max: new Date(0, 0, 0, 16, 0, 0), // 4 PM
  culture: 'sv-SE',
  formats: {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
  },
};

// Helper function to transform API slot data to calendar events
export const slotToCalendarEvent = (slot) => ({
  id: slot.id,
  title: slot.employeeName || slot.patientName || 'Appointment',
  start: new Date(slot.startTime),
  end: new Date(slot.endTime),
  resource: slot, // Keep full slot data for access
});