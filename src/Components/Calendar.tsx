import React, { FC, ReactNode } from 'react';
import FullCalendar, {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
  EventSourceInput,
  EventInput,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { useEvent } from 'src/Hooks/useEvents';
import { Box, Typography } from '@mui/material';

interface DemoAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
}

// const handleWeekendsToggle = () => {
//     this.setState({
//       weekendsVisible: !this.state.weekendsVisible,
//     });
//   };

//   const handleEvents = (events: EventApi[]) => {
//     this.setState({
//       currentEvents: events,
//     });
//   };

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i> {eventContent.event.title}</i>
    </>
  );
}

const Calendar: FC = () => {
  const Events = useEvent();

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      Events.removeEvent(parseInt(clickInfo.event.id));
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    let title = 'Testo';
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    console.log('before add', Events.events);
    if (title) {
      console.log('after if');
      console.log(Events.addEvent);
      Events.addEvent?.({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        // allDay: selectInfo.allDay,
        // @todo organization color, URL
        backgroundColor: '#3788d8',
        url: '',
      });
      console.log('after add', Events.events);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek',
      }}
      initialView="timeGridWeek"
      editable={true}
      slotMinTime={'08:00:00'}
      slotMaxTime={'24:00:00'}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      // weekends={this.state.weekendsVisible}
      events={Events.events}
      // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
      select={handleDateSelect}
      eventContent={renderEventContent} // custom render function
      eventClick={handleEventClick}
      //   eventsSet={handleEvents} // called after events are initialized/added/changed/removed
      /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
    />
  );
};

export default Calendar;
