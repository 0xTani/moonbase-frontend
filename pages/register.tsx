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
import { DEFAULT_NEW_USER_FORM } from 'src/Types/Constants';
import { INewUserForm } from 'src/Types/TUser';

const Register: NextPage = () => {
  const [newUser, setNewUser] = React.useState<INewUserForm>(DEFAULT_NEW_USER_FORM);

  const handleChange = (prop: keyof INewUserForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [prop]: event.target.value });
  };

  function register() {
    feathersClient.service('users').create(newUser).then(setNewUser(DEFAULT_NEW_USER_FORM));
  }

  const marginBottom = '25px';

  const memberCard = (
    <Grid item md={8}>
      <Card sx={{ textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h5" component="span" sx={{ margin: '10px 0 10px 0', fontWeight: 600, flexGrow: 1 }}>
            🌒 New user
          </Typography>
        </CardContent>
        <Divider></Divider>
        <CardContent sx={{ textAlign: 'center' }}>
          {/* Username */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Username</InputLabel>
            <OutlinedInput
              required
              onChange={handleChange('username')}
              value={newUser.username}
              id="register-username"
              label="Username"
            />
            <FormHelperText>Username *</FormHelperText>
          </FormControl>

          {/* Alias */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Alias</InputLabel>
            <OutlinedInput onChange={handleChange('alias')} value={newUser.alias} id="register-alias" label="Alias" />
            <FormHelperText>Alias (Blank sets your username)</FormHelperText>
          </FormControl>

          {/* Twitter */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Twitter</InputLabel>
            <OutlinedInput
              onChange={handleChange('twitter')}
              value={newUser.twitter}
              id="register-twitter"
              label="Twitter"
            />
            <FormHelperText>Twitter </FormHelperText>
          </FormControl>

          {/* Telegram */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Telegram</InputLabel>
            <OutlinedInput
              onChange={handleChange('telegram')}
              value={newUser.telegram}
              id="register-telegram"
              label="Alias"
            />
            <FormHelperText>Telegram </FormHelperText>
          </FormControl>

          {/* Fob ID field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="register-fobid">Fob Number</InputLabel>
            <OutlinedInput
              onChange={handleChange('fobId')}
              type="number"
              id="register-fobid"
              value={newUser.fobId}
              label="Fob Number"
            />
            <FormHelperText>The number on your fob (if you are a DCTRL member)</FormHelperText>
          </FormControl>
          {/* Password */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom }}>
            <InputLabel htmlFor="register-password">Password</InputLabel>
            <OutlinedInput
              onChange={handleChange('password')}
              type="password"
              id="register-password"
              value={newUser.password}
              label="Password"
            />
            <FormHelperText>Password *</FormHelperText>
          </FormControl>
          {/* Months active field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel htmlFor="register-repeatpassword">Repeat password</InputLabel>
            <OutlinedInput
              onChange={handleChange('repeatpassword')}
              type="password"
              id="register-repeatpassword"
              value={newUser.repeatpassword}
              label="Repeat password"
            />
            <FormHelperText>Repeat password *</FormHelperText>
          </FormControl>

          <Button
            disabled={!(newUser.password !== '' && newUser.password === newUser.repeatpassword)}
            variant="outlined"
            onClick={() => {
              register();
            }}
          >
            Create new User
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
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minHeight: '100vh', textAlign: 'center', paddingLeft: '250px' }}
        >
          {memberCard}
        </Grid>
      </main>
    </>
  );
};

export default Register;
