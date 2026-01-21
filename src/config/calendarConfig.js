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

export const getEventStyle = (event, isSelected = false) => {
  const { status } = event.resource || {};
  
  let backgroundColor = '#2fadaa';
  let borderColor = '#057d7a';
  
  if (status === 'AVAILABLE') {
    backgroundColor = '#10b981';
    borderColor = '#059669';
  } else if (status === 'BOOKED') {
    backgroundColor = '#f59e0b';
    borderColor = '#d97706';
  } else if (status === 'CANCELLED') {
    backgroundColor = '#ef4444';
    borderColor = '#dc2626';
  }
  
  if (isSelected) {
    backgroundColor = '#057d7a';
    borderColor = '#045c59';
  }
  
  return {
    style: {
      backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '8px',
      opacity: 1,
      color: 'white',
      border: isSelected ? '2px solid #045c59' : 'none',
      display: 'block',
    },
  };
};

export default {
  localizer,
  calendarDefaults,
  slotToCalendarEvent,
  getEventStyle,
};
