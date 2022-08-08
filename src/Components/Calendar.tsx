import React, { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FullCalendar, {
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
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  Modal,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { EVENT_NEW_BLANK, IEvent, IEventNew } from 'src/context/EventContext';
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
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | null>(null);
  const [calendarApi, setCalendarApi] = React.useState<CalendarApi | null>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.jsEvent.preventDefault();
    setSelectedEvent(Events.getEventById(clickInfo.event.id));
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
      id="addEventModal"
    >
      <Grid
        id="addEventModalGrid"
        container
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ minHeight: '100vh' }}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent> & { target: HTMLElement }) => {
          if (event.target.id === 'addEventModalGrid') setNewEvent(EVENT_NEW_BLANK);
        }}
      >
        <Grid item sm={11} md={10} lg={4} id="addEventModalCard">
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
                <InputLabel htmlFor="input-description">Description</InputLabel>
                <OutlinedInput
                  multiline
                  autoComplete="off"
                  id="input-description"
                  value={newEvent.description}
                  onChange={handleChange('description')}
                  label="description"
                  rows={8}
                />
              </FormControl>

              {OrganizationSelector()}
              <Button
                sx={{ marginTop: '2rem' }}
                variant="contained"
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

  const viewEventModal = (
    <Modal
      // onClick={(e: any) => setNewEvent(EVENT_NEW_BLANK)}
      open={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container justifyContent={'center'} alignItems={'center'} sx={{ minHeight: '100vh' }}>
        <Grid item md={4}>
          <Card>
            <CardHeader
              action={
                <IconButton color="error" onClick={() => setSelectedEvent(null)}>
                  <CloseIcon></CloseIcon>
                </IconButton>
              }
              title={
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {Organization.getOrganizationById('' + selectedEvent?.organizationId)?.name +
                    ' - ' +
                    selectedEvent?.title}
                </Typography>
              }
            ></CardHeader>
            <Divider />
            <CardContent>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedEvent?.description && selectedEvent?.description.length > 0
                  ? selectedEvent?.description
                  : 'No event description'}
              </Typography>
            </CardContent>
            <Divider />
            {selectedEvent?.url !== '' ? (
              <CardContent>
                <Link href={selectedEvent?.url}>View online</Link>
              </CardContent>
            ) : (
              ''
            )}
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
  return (
    <>
      {addEventModal}
      {viewEventModal}
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
