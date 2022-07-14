import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Typography } from '@mui/material';

import React from 'react';
import feathersClient from 'client';
import Sidebar from 'src/Components/App/Sidebar';
import { TopNavBar } from 'src/Components/App/TopNavBar';
import { useUser } from 'src/Hooks/useUser';

function capitalizeFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

const Home: NextPage = () => {
  const [credentials, setCredentials] = React.useState({ username: 'tristani', password: 'yesser' });
  const User = useUser();

  const handleUserNameChange = (event: any) => {
    setCredentials(credentials => ({
      ...credentials,
      username: event.target.value,
    }));
  };
  const handlePasswordChange = (event: any) => {
    setCredentials(credentials => ({
      ...credentials,
      password: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await feathersClient.authenticate({ strategy: 'local', ...credentials });
      const result = await feathersClient.get('authentication');
      if (result) {
        User.setUser!(result.user);
        User.setAuthentication!(result.authentication);
      }
    } catch (error: any) {
      throw Error(error);
    }
  };

  const loginCard = (
    <Grid item md={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            🌒 MoonBase Members Area
          </Typography>
        </CardContent>
        <Divider></Divider>
        <CardContent>
          <TextField
            fullWidth
            id="usernameinput"
            label="Username"
            variant="outlined"
            margin="normal"
            value={credentials.username}
            onChange={handleUserNameChange}
          />
          <TextField
            fullWidth
            type={'password'}
            id="passwordinput"
            label="Password"
            variant="outlined"
            margin="normal"
            value={credentials.password}
            onChange={handlePasswordChange}
          />
          <Button variant="outlined" sx={{ marginTop: '15px' }} onClick={handleSubmit}>
            Enter 🌒
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
  const memberCard = (
    <Grid item md={4}>
      <Card sx={{ textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h5" component="span" sx={{ margin: '10px 0 10px 0', fontWeight: 600, flexGrow: 1 }}>
            🌒 {User.user && capitalizeFirst(User.user.username)}
          </Typography>
          {User.user.active === 1 ? (
            <Button variant={'outlined'} color="success" size={'small'} sx={{ float: 'right' }}>
              Active
            </Button>
          ) : (
            <Button variant={'outlined'} size={'small'} sx={{ float: 'right' }} disabled>
              Inactive
            </Button>
          )}
        </CardContent>
        <Divider></Divider>

        <CardContent>
          {/* <Typography variant="h6" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            Username: {User && User.user.username}
          </Typography> */}
          <Typography variant="h6" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            Address: {User && User.user.ethaddress}
          </Typography>
          <Typography variant="h6" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            Fob ID: {User && User.user.fobId}
          </Typography>
          <Typography variant="h6" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            Months active: {User && User.user.monthsActive}
          </Typography>
          <Typography variant="h6" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            Credits: {User && User.user.credits}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Button variant={'outlined'} color="primary" size={'small'} sx={{ marginRight: '10px' }}>
            🤝 Member
          </Button>
          <Button variant={'outlined'} color="success" size={'small'} sx={{ marginRight: '10px' }}>
            💻 Contributooor
          </Button>
          <Button variant={'outlined'} color="secondary" size={'small'} sx={{ marginRight: '10px' }}>
            ⭐ Legend
          </Button>
          <Button variant={'outlined'} color="info" size={'small'} sx={{ marginRight: '10px' }}>
            🎤 Speakooor
          </Button>
          <Button variant={'outlined'} color="warning" size={'small'} sx={{ marginRight: '10px' }}>
            🐱‍👤 Helpooor
          </Button>
        </CardContent>
      </Card>
    </Grid>
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
        {/* {User.isAuthenticated ? <Sidebar /> : ''} */}
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minHeight: '100vh', textAlign: 'center' }}
        >
          {/* {loginCard} */}
          {User.isAuthenticated ? memberCard : loginCard}
        </Grid>
      </main>
    </>
  );
};

export default Home;
