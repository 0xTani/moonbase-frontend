import React, { FC } from 'react';
import FullCalendar, {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  CalendarApi,
  EventChangeArg,
} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEvent } from 'src/Hooks/useEvents';
import { useUser } from 'src/Hooks/useUser';
import { arrayStringParse } from 'src/Types/helpers';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Modal,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { EVENT_NEW_BLANK, IEventNew } from 'src/context/EventContext';
import { useOrganization } from 'src/Hooks/useOrganization';
import { IOrganization } from 'src/context/OrganizationContext';

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
  const Organization = useOrganization();
  const [newEvent, setNewEvent] = React.useState<IEventNew>(EVENT_NEW_BLANK);
  const [calendarApi, setCalendarApi] = React.useState<CalendarApi | null>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (Organization.adminMode) {
      clickInfo.jsEvent.preventDefault();
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        Events.removeEvent(parseInt(clickInfo.event.id));
      }
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    let calendarApi = selectInfo.view.calendar;
    if (Organization.adminMode) {
      setNewEvent({
        ...newEvent,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        organizationId: parseInt(Organization.organizations[0].id),
        backgroundColor: Organization.organizations[0].backgroundColor,
      });
      setCalendarApi(calendarApi);
      // calendarApi.unselect(); // clear date selection
    }
  };

  function addedEvent() {
    if (calendarApi) calendarApi.unselect();
    setNewEvent(EVENT_NEW_BLANK);
  }

  const handleChange = (prop: keyof IEventNew) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [prop]: event.target.value });
  };

  function eventChanged(eventChangeArg: EventChangeArg) {
    const changedEvent = eventChangeArg.event;
    const eventObj = Events.getEventById(changedEvent.id);
    if (eventObj) {
      Events.eventChanged({ ...eventObj, start: changedEvent.startStr, end: changedEvent.endStr });
    }
  }

  const OrganizationSelector = () => {
    const orgButtons = Organization.organizations.map((og: IOrganization) => {
      return (
        <FormControlLabel
          control={<Checkbox />}
          sx={{
            userSelect: 'none',
            backgroundColor: og.backgroundColor,
            paddingRight: '12px',
            marginRight: '35px',
            borderRadius: '5px',
          }}
          checked={parseInt(og.id) === newEvent.organizationId}
          label={og.name}
          onChange={() => {
            setNewEvent({ ...newEvent, organizationId: parseInt(og.id), backgroundColor: og.backgroundColor });
          }}
        />
      );
    });

    return <Box>{orgButtons}</Box>;
  };

  const addEventModal = (
    <Modal
      // onClick={(e: any) => setNewEvent(EVENT_NEW_BLANK)}
      open={newEvent.organizationId !== -1}
      onClose={() => setNewEvent(EVENT_NEW_BLANK)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ minHeight: '100vh' }}>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                New Event
              </Typography>
            </CardContent>
            <Divider />
            <CardContent sx={{ textAlign: 'center' }}>
              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-title">Title</InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  id="input-title"
                  value={newEvent.title}
                  onChange={handleChange('title')}
                  label="Title"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-url">Url</InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  id="input-url"
                  value={newEvent.url}
                  onChange={handleChange('url')}
                  label="url"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-message">Message</InputLabel>
                <OutlinedInput
                  multiline
                  autoComplete="off"
                  id="input-message"
                  value={newEvent.message}
                  onChange={handleChange('message')}
                  label="Message"
                />
              </FormControl>

              {OrganizationSelector()}
              <Button
                onClick={() => {
                  Events.addEvent(newEvent).then(() => addedEvent());
                }}
              >
                Add event
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );

  return (
    <>
      {addEventModal}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek',
        }}
        initialView="timeGridWeek"
        editable={Organization.adminMode}
        slotMinTime={'08:00:00'}
        slotMaxTime={'24:00:00'}
        selectable={Organization.adminMode}
        selectMirror={true}
        dayMaxEvents={true}
        events={Events.eventsFiltered(arrayStringParse(User.user.organizationsSelected))}
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        eventChange={eventChanged}
      />
    </>
  );
};

export default Calendar;
