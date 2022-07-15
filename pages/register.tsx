import type { NextPage } from 'next';
import Head from 'next/head';
import { AppBar, Box, Button, Card, CardContent, Divider, Grid, TextField, Toolbar, Typography } from '@mui/material';

import React from 'react';
import feathersClient from 'client';

interface IUserResponse {
  id: number;
  username: string;
  ethaddress: string | null;
  fobId: string | null;
  alias: string | null;
  password: string;
  credits: number;
  active: number;
  monthsActive: number;
  pfp: string;
  createdAt: string;
  updatedAt: string;
}

const Home: NextPage = () => {
  const [credentials, setCredentials] = React.useState({ username: '', password: '', fobId: '', ethaddress: '' });
  const [registered, setRegistered] = React.useState(false);

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
  const handleEthAddressChange = (event: any) => {
    setCredentials(credentials => ({
      ...credentials,
      ethaddress: event.target.value,
    }));
  };
  const handleFobIdChange = (event: any) => {
    setCredentials(credentials => ({
      ...credentials,
      fobId: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      feathersClient
        .service('users')
        .create(credentials)
        .then((r: any) => {
          setRegistered(true);
          console.log(r);
        })
        .catch((e: any) => console.log(e));
    } catch (error: any) {
      throw Error(error);
    }
  };

  const loginCard = (
    <Grid item md={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ margin: '10px 0 10px 0', fontWeight: 600 }}>
            🌒 MoonBase Sign Up
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
          <TextField
            fullWidth
            id="fobinput"
            label="Fob ID"
            variant="outlined"
            margin="normal"
            value={credentials.fobId}
            onChange={handleFobIdChange}
          />
          <TextField
            fullWidth
            id="fobinput"
            label="ETH Address"
            variant="outlined"
            margin="normal"
            value={credentials.ethaddress}
            onChange={handleEthAddressChange}
          />
          <Button variant="outlined" sx={{ marginTop: '15px' }} onClick={handleSubmit}>
            Join 🌒
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ backgroundColor: '#0a1929' }}>
      <Head>
        <title>MoonBase Member Interface</title>
        <meta name="description" content="Decentralized community" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppBar position="fixed" sx={{ backgroundColor: '#003162' }}>
          <Toolbar>
            <Typography variant="h6">MoonBase Station</Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minHeight: '100vh', textAlign: 'center' }}
        >
          {registered ? (
            <Typography variant="h2" color="#f2a900">
              Welcome to MoonBase!
            </Typography>
          ) : (
            loginCard
          )}
        </Grid>
      </main>
    </Box>
  );
};

export default Home;
