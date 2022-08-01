import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import feathersClient from 'client';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Calendar from 'src/Components/Calendar';
import { useEvent } from 'src/Hooks/useEvents';
import { DEFAULT_NEW_USER_FORM } from 'src/Types/Constants';
import { INewUserForm } from 'src/Types/TUser';

const Events: NextPage = () => {
  const [newUser, setNewUser] = React.useState<INewUserForm>(DEFAULT_NEW_USER_FORM);
  const Events = useEvent();

  const handleChange = (prop: keyof INewUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [prop]: event.target.value });
  };

  function register() {
    feathersClient.service('users').create(newUser).then(setNewUser(DEFAULT_NEW_USER_FORM));
  }

  const marginBottom = '25px';

  return (
    <>
      <Head>
        <title>MoonBase Member Interface</title>
        <meta name="description" content="Decentralized community" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minHeight: '100vh', textAlign: 'center', paddingLeft: '250px' }}
        >
          <Grid item lg={11} xl={11}>
            <>
              {Events.events.toString}
              <Calendar />
            </>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Events;
