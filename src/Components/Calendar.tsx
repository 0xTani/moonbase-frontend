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
import feathersClient from 'client';

import ReactDOM from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import ConfirmButton from './App/Buttons/ConfirmButton';

interface IAttendanceMode {
  eventId: number;
  QRcode: string;
}

const cardModal = { border: '2px solid #ccccff77', boxShadow: '2px 2px 12px #ccccff44' };

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
  const [attendanceMode, setAttendanceMode] = React.useState<IAttendanceMode | null>(null);

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

  function deleteEvent(id: number) {
    feathersClient.service('event').remove(id);
  }

  const OrganizationSelector = () => {
    const orgButtons = Organization.organizations.map((og: IOrganization) => {
      return (
        <FormControlLabel
          key={'calendar' + og.id}
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

  function renderEventList() {
    const items = Events.events.map((event: IEvent) => {
      return (
        <Grid
          md={4}
          sx={{ padding: ' 20px 10px' }}
          onClick={() => {
            deleteEvent(parseInt(event.id));
          }}
        >
          <Card sx={{}}>
            <CardHeader title={event.title}></CardHeader>

            <CardContent>
              <table>
                <tbody>
                  <th>
                    <tr>ID</tr>
                    <tr>description</tr>
                    <tr>url</tr>
                    <tr>start</tr>
                    <tr>end</tr>
                  </th>

                  <td>
                    <tr>{event.id}</tr>
                    <tr>{event.description}</tr>
                    <tr>{event.url}</tr>
                    <tr>{event.start}</tr>
                    <tr>{event.end}</tr>
                  </td>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid>
      );
    });

    return <Grid container>{items}</Grid>;
  }

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
          <Card sx={cardModal}>
            <CardContent>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                New Event 📅
              </Typography>
            </CardContent>
            <Divider />
            <CardContent sx={{ textAlign: 'center' }}>
              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-title">Title 🔠</InputLabel>
                {/* @todo fix autofocus */}
                <OutlinedInput
                  autoFocus
                  autoComplete="off"
                  id="input-title"
                  value={newEvent.title}
                  onChange={handleChange('title')}
                  label="Title 🔠"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-url">Url 🎯</InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  id="input-url"
                  value={newEvent.url}
                  onChange={handleChange('url')}
                  label="url 🎯"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
                <InputLabel htmlFor="input-description">Description 🧾</InputLabel>
                <OutlinedInput
                  multiline
                  autoComplete="off"
                  id="input-description"
                  value={newEvent.description}
                  onChange={handleChange('description')}
                  label="description 🧾"
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

  var QRCode = require('qrcode');

  function renderEventAdminMode() {
    if (Organization.adminMode)
      return (
        <Box sx={{ backgroundColor: '#00ff0029', height: 130 }}>
          <CardContent>
            <Typography sx={{ marginBottom: '22px' }}>Admin mode</Typography>

            <Button
              variant={attendanceMode ? 'outlined' : 'contained'}
              color="secondary"
              onClick={() => {
                if (attendanceMode) {
                  console.log('attendanceMode true');
                  setAttendanceMode(null);
                } else {
                  console.log('attendanceMode false');

                  setAttendanceMode({ eventId: parseInt(selectedEvent!!.id), QRcode: 'okok' });
                }
              }}
            >
              Attendance Mode
            </Button>
            <ConfirmButton
              onClick={() => {
                feathersClient.service('event').remove(selectedEvent?.id);
                setSelectedEvent(null);
              }}
              text="Delete Event ✖"
              variant="contained"
              color="error"
              sx={{ float: 'right', minWidth: '130px' }}
            />
          </CardContent>
        </Box>
      );
    else return <></>;
  }

  const viewEventModalDescription = (
    <>
      <CardContent sx={{ minHeight: '300px' }}>
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
    </>
  );

  const viewEventModalAttendanceMode = (
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h5">Scan to get a participation award</Typography>

      <Box
        sx={{
          borderRadius: '10px',
          marginTop: '1rem',
          padding: '8px 8px 3px 8px',
          backgroundColor: 'white',
          display: 'inline-block',
          marginBottom: '1rem',
        }}
      >
        <QRCodeSVG size={300} value={`http://localhost:3000/attendance/${selectedEvent?.uuid}`} />
      </Box>

      <br />
      <Link href={`http://localhost:3000/attendance/${selectedEvent?.uuid}`}> Linkkkkkk </Link>
    </CardContent>
  );

  const viewEventModal = (
    <Modal
      // onClick={(e: any) => setNewEvent(EVENT_NEW_BLANK)}
      open={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid
        id="viewEventModalGrid"
        container
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ minHeight: '100vh' }}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent> & { target: HTMLElement }) => {
          if (event.target.id === 'viewEventModalGrid') setSelectedEvent(null);
        }}
      >
        <Grid item md={4}>
          <Card sx={cardModal}>
            <CardContent sx={{ fontSize: '20px' }}>
              <Box
                sx={{
                  userSelect: 'none',
                  backgroundColor: selectedEvent?.backgroundColor,
                  padding: '6px 12px',
                  borderRadius: '5px',
                  display: 'inline-block',
                  marginRight: '1rem',
                }}
              >
                <Typography variant="h6">
                  {Organization.getOrganizationById('' + selectedEvent?.organizationId)?.name}
                </Typography>
              </Box>
              <span>{selectedEvent && selectedEvent.title}</span>
              <IconButton sx={{ float: 'right' }} color="error" onClick={() => setSelectedEvent(null)}>
                <CloseIcon></CloseIcon>
              </IconButton>
            </CardContent>

            <Divider />
            {attendanceMode ? viewEventModalAttendanceMode : viewEventModalDescription}
            {renderEventAdminMode()}
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
      {/* {renderEventList()} */}
    </>
  );
};

export default Calendar;
