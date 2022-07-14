import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';

import React from 'react';
import feathersClient from 'client';
import Sidebar from 'src/Components/App/Sidebar';
import { TopNavBar } from 'src/Components/App/TopNavBar';
import { useUser } from 'src/Hooks/useUser';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function capitalizeFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

const Settings: NextPage = () => {
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

  interface State {
    fobId: string;
    password: string;
    repeatPassword: string;
    showPassword: boolean;
  }
  const [values, setValues] = React.useState<State>({
    fobId: User.user.fobId ? User.user.fobId : '',
    password: '',
    repeatPassword: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
    console.log(values.showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(prop, event);
    setValues({ ...values, [prop]: event.target.value });
  };

  function linkAddress() {}

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
          {/* ETH address */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">ETH Address</InputLabel>
            <OutlinedInput
              readOnly
              value={User.user.ethaddress}
              id="outlined-adornment-ethaddress"
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={linkAddress}
                    sx={{ paddingLeft: '8px', paddingRight: '10px' }}
                  >
                    🔗 Link
                  </Button>
                </InputAdornment>
              }
              label="ETH Address"
            />
            <FormHelperText>The ETH address you linked. Press Link to link the connected account</FormHelperText>
          </FormControl>

          {/* Fob ID field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Fob Number</InputLabel>
            <OutlinedInput
              type="number"
              id="input-fobid"
              value={values.fobId}
              onChange={handleChange('fobId')}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    disabled={User.user.fobId === values.fobId}
                    color="warning"
                    variant="outlined"
                    onClick={linkAddress}
                    sx={{ paddingLeft: '8px', paddingRight: '10px' }}
                  >
                    💾 Save
                  </Button>
                </InputAdornment>
              }
              label="Fob Number"
            />
            <FormHelperText>The number on the fob you received from a member</FormHelperText>
          </FormControl>
        </CardContent>
        <Divider />
        <CardContent sx={{ textAlign: 'center', marginTop: '1rem' }}>
          {/* Password fields */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              autoComplete="off"
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '1rem' }}>
            <InputLabel htmlFor="input-repeat-password">Repeat Password</InputLabel>
            <OutlinedInput
              autoComplete="off"
              id="input-repeat-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.repeatPassword}
              onChange={handleChange('repeatPassword')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Repeat Password"
            />
          </FormControl>
          <Button
            disabled={
              values.password === '' || values.repeatPassword === '' || values.password !== values.repeatPassword
            }
            variant="outlined"
          >
            Change Password
          </Button>
        </CardContent>

        <Divider />

        <CardContent>
          {/* Credits */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <InputLabel htmlFor="input-credits">Credits</InputLabel>
            <OutlinedInput
              readOnly
              value={User.user.credits}
              id="input-credits"
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={linkAddress}
                    sx={{ paddingLeft: '8px', paddingRight: '10px' }}
                  >
                    🔎 Refresh
                  </Button>
                </InputAdornment>
              }
              label="Credits"
            />
            <FormHelperText>1 Credit = 1 USDC. Refresh to get latest balance</FormHelperText>
          </FormControl>

          {/* Status */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px', marginTop: '20px' }}>
            <InputLabel htmlFor="input-status">Status</InputLabel>
            <OutlinedInput
              readOnly
              value={User.user.active === 1 ? 'Active' : 'Inactive'}
              id="input-status"
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={linkAddress}
                    sx={{ paddingLeft: '8px', paddingRight: '10px' }}
                  >
                    🔎 Refresh
                  </Button>
                </InputAdornment>
              }
              label="Status"
            />
            <FormHelperText>
              An active user has paid the monthly donation. Refresh to bill the account and activate it
            </FormHelperText>
          </FormControl>
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
          {User.isAuthenticated ? memberCard : memberCard}
        </Grid>
      </main>
    </>
  );
};

export default Settings;
