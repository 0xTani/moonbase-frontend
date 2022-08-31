import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useEvent } from 'src/Hooks/useEvents';
import { useOrganization } from 'src/Hooks/useOrganization';

const Post: NextPage = () => {
  const router = useRouter();
  const { eventUUID } = router.query;
  const Events = useEvent();
  const Organization = useOrganization();

  const event = Events.getEventByUUID(eventUUID as string);

  const organization = Organization.getOrganizationById(event?.organizationId.toString() ?? '0');

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
      <CardContent>
        <Typography variant="h6">
          Congratulations, you have checked in <u>{event && event.title}</u>. It will show attendance on your profile.
        </Typography>

        <Typography sx={{ margin: '1rem 0' }} variant="h6">
          To set a private attendance, click on private attendance. It will not show on your profile.
        </Typography>
        <Typography sx={{ margin: '1rem 0 4rem 0' }} variant="h6">
          To mint a Poof Of Attendance Protocol token (POAP) to your linked address, click on Mint POAP
        </Typography>
        <Button size="large" variant="contained">
          Private attendance
        </Button>
        <Button size="large" sx={{ float: 'right' }} variant="contained">
          Mint POAP to linked Address
        </Button>
      </CardContent>
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
