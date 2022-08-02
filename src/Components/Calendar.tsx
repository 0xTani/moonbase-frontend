import React, { FC } from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEvent } from 'src/Hooks/useEvents';
import { useUser } from 'src/Hooks/useUser';
import { arrayStringParse } from 'src/Types/helpers';

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
  const User = useUser();
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
        organizationId: 3,
        backgroundColor: '#6447cc',
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
      events={Events.eventsFiltered(arrayStringParse(User.user.organizationsSelected))}
      select={handleDateSelect}
      eventContent={renderEventContent} // custom render function
      eventClick={handleEventClick}
      /* @todo event change
            eventChange={function(){}}
            */
    />
  );
};

export default Calendar;
