import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';

import React, { useEffect } from 'react';
import { useUser } from 'src/Hooks/useUser';
import { capitalizeFirst, isDev } from 'src/Types/helpers';
import { checkIsAccountActive } from 'client/transactions';
import feathersClient from 'client';
import { IUser } from 'src/Types/TUser';
import { useAccount } from 'wagmi';

const Settings: NextPage = () => {
  const User = useUser();
  const account = useAccount();

  // todo change that interface
  interface State {
    fobId: string;
    password: string;
    repeatPassword: string;
    showPassword: boolean;
  }

  //   sets fobId when page gets refreshed, prob needs to be cleaner
  useEffect(() => {
    setValues({ ...values, fobId: User.user.fobId ? User.user.fobId : '' });
  }, [User.user.fobId]);

  const [values, setValues] = React.useState<State>({
    fobId: '',
    password: '',
    repeatPassword: '',
    showPassword: false,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function refreshAccountStatus() {
    if (User.user.ethaddress) {
      const userStatusBoolean = User.user.active === 1;
      checkIsAccountActive(User.user.ethaddress).then((active: boolean) => {
        if (isDev) console.log('active: ', active);
        if (userStatusBoolean !== active) {
          feathersClient
            .service('users')
            .patch(User.user.id, { active: active })
            .then((user: IUser) => {
              if (isDev) console.log('refresh account status: ', user);
              User.setUser!(user);
            });
        }
      });
    }
  }

  function changePassword() {
    feathersClient
      .service('users')
      .patch(User.user.id, { password: values.password })
      .then((u: any) => {
        setValues({ ...values, password: '', repeatPassword: '' });
      });
  }

  function linkAddress() {}
  function saveFobId() {
    feathersClient
      .service('users')
      .patch(User.user.id, { fobId: values.fobId })
      .then((u: IUser) => User.setUser!(u));
  }
  const SettingsCard = User.isAuthenticated ? (
    <Grid item md={10} lg={8} xl={5}>
      <Card sx={{ textAlign: 'left' }}>
        <CardContent>
          {/* username */}
          <Typography variant="h5" component="span" sx={{ margin: '10px 0 10px 0', fontWeight: 600, flexGrow: 1 }}>
            🌒 {User.user && capitalizeFirst(User.user.username)}
          </Typography>
          {/* active button */}
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
        <Divider />

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
                    onClick={saveFobId}
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

        {/* Password fields */}
        <CardContent sx={{ textAlign: 'center', marginTop: '1rem' }}>
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '2rem' }}>
            <InputLabel htmlFor="input-password">Password</InputLabel>
            <OutlinedInput
              autoComplete="off"
              id="input-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
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
              label="Repeat Password"
            />
          </FormControl>
          <Button
            onClick={() => {
              changePassword();
            }}
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
              id="input-status
              
              "
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    disabled={!User.user.ethaddress || User.user.ethaddress.length === 0}
                    color="warning"
                    variant="outlined"
                    onClick={refreshAccountStatus}
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
      </Card>
    </Grid>
  ) : (
    ''
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
          {SettingsCard}
        </Grid>
      </main>
    </>
  );
};

export default Settings;
