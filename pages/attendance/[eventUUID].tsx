import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import feathersClient from 'client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IAttendance } from 'src/context/AttendanceContext';
import { useAttendance } from 'src/Hooks/useAttendance';
import { useEvent } from 'src/Hooks/useEvents';
import { useOrganization } from 'src/Hooks/useOrganization';
import { useUser } from 'src/Hooks/useUser';

const Post: NextPage = () => {
  const router = useRouter();
  const { eventUUID } = router.query;
  const Events = useEvent();
  const Organization = useOrganization();
  const Attendance = useAttendance();
  const User = useUser();
  const event = Events.getEventByUUID(eventUUID as string);
  const organization = Organization.getOrganizationById(event?.organizationId.toString() ?? '0');
  const attendance = Attendance.getAttendanceByUserIdEventId(User.user.id, parseInt(event?.id ?? '0'));

  function createAttendance(privateAttendance: boolean) {
    feathersClient.service('attendance').create({ privateAttendance, userId: User.user.id, eventId: event?.id });
  }

  function changeAttendanceStatus(attendanceId: number, privateAttendance: boolean) {
    feathersClient.service('attendance').patch(attendanceId, { privateAttendance });
  }

  function attendanceExists(attendance: IAttendance | null) {
    return (
      <CardContent>
        <Typography variant="h6">
          Congratulations, you have checked in <u>{event && event.title}</u>.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
          Your attendance is {attendance?.privateAttendance ? <u>Private</u> : <u>Public</u>}
        </Typography>

        {attendance?.privateAttendance ? (
          <Button
            onClick={() => changeAttendanceStatus(parseInt(attendance.id), false)}
            size="large"
            variant="contained"
          >
            Set Attendance Public 👤
          </Button>
        ) : (
          <Button
            onClick={() => changeAttendanceStatus(parseInt(attendance?.id ?? '0'), true)}
            size="large"
            variant="contained"
          >
            Set Attendance Private 🐱‍👤
          </Button>
        )}
      </CardContent>
    );
  }

  const attendanceDoesntExist = (
    <CardContent>
      <Typography variant="h6">
        Congratulations, you have attended <u>{event && event.title}</u>.
      </Typography>
      <Typography variant="h6" sx={{ marginTop: '1rem' }}>
        If you want to check in, press Public attendance. It will show in your profile.
      </Typography>
      <Button onClick={() => createAttendance(false)} size="large" variant="contained" sx={{ marginTop: '1rem' }}>
        Public Attendance 👤
      </Button>
      <Typography sx={{ margin: '2rem 0 1rem 0' }} variant="h6">
        To set a private attendance, click on private attendance. It will not show on your public profile.
      </Typography>
      <Button onClick={() => createAttendance(true)} size="large" variant="contained">
        Private Attendance 🐱‍👤
      </Button>
    </CardContent>
  );

  function mintPoapLinked() {
    feathersClient.service('attendance').patch(attendance?.id, { poapMinted: true });
  }

  function poapControls() {
    if (attendance && attendance.poapMinted) {
      return (
        <>
          <Divider sx={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography>Poap minted!</Typography>
          </CardContent>
        </>
      );
    } else {
      return (
        <>
          <Divider sx={{ marginTop: '1rem' }} />
          <CardContent>
            <Typography sx={{ margin: '0.5rem 0 1rem 0' }} variant="h6">
              You can also mint a Proof of Attendance Protcol (POAP) token!
            </Typography>
            <Button size="large" variant="contained" onClick={() => mintPoapLinked()}>
              Mint POAP to Linked address 🥇
            </Button>
            <Button size="large" sx={{ float: 'right' }} variant="contained" onClick={() => mintPoapLinked()}>
              Mint POAP to Other address 🔗
            </Button>
          </CardContent>
        </>
      );
    }
  }

  const eventExists = (
    <Card>
      <CardContent sx={{ fontSize: '20px' }}>
        <Box
          sx={{
            userSelect: 'none',
            backgroundColor: organization?.backgroundColor,
            padding: '6px 12px',
            borderRadius: '5px',
            display: 'inline-block',
            marginRight: '1rem',
          }}
        >
          <Typography variant="h6"> {organization?.name} </Typography>
        </Box>
        <span>{event && event.title}</span>
      </CardContent>
      <Divider />
      {attendance ? attendanceExists(attendance) : attendanceDoesntExist}
      {poapControls()}
    </Card>
  );

  const eventDoesnt = (
    <Card>
      <CardHeader title={event && event.title} />
      <Divider />
      <CardContent>
        <Typography variant="h6">Event doesnt exist</Typography>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Head>
        <title>MoonBase Member Interface</title>
        <meta name="description" content="Decentralized community" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid container alignItems={'center'} justifyContent={'center'} sx={{ minHeight: '100vh' }}>
          <Grid item md={4}>
            {event ? eventExists : eventDoesnt}
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Post;
