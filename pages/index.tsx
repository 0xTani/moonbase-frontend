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
  InputLabel,
  OutlinedInput,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';

import React from 'react';
import feathersClient from 'client';
import { useUser } from 'src/Hooks/useUser';
import { capitalizeFirst } from 'src/Types/helpers';
import { useUsers } from 'src/Hooks/useUsers';
import { useAlertContext } from 'src/Hooks/useAlert';

const Home: NextPage = () => {
  const [credentials, setCredentials] = React.useState({ username: 'tristani', password: 'yesser' });
  const User = useUser();
  const Users = useUsers();

  function displayBadges(userBadgesString: string) {
    return Users.getUserBadges(userBadgesString).map((b, i: number) => (
      <HtmlTooltip
        key={i}
        title={
          <React.Fragment>
            <Typography color="inherit">{b.name}</Typography>
            <p>{b.definition}</p>
          </React.Fragment>
        }
      >
        <Button variant="outlined" size="small" color={b.color} sx={{ marginLeft: '10px' }}>
          {b.name}
        </Button>
      </HtmlTooltip>
    ));
  }
  const Alert = useAlertContext();
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#001e3c',
      maxWidth: 320,
      fontSize: theme.typography.pxToRem(14),
      border: '1px solid #dadde9',
    },
  }));

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
        User.initUser!(result.user);
        User.setAuthentication!(result.authentication);
        Users.initializeUsers('index');
      }
      // @todo error typing
    } catch (error: any) {
      Alert.toggleAlert({ body: error.message, duration: 2000, severity: 'error', showing: true });
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
          {/* ETH address */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '40px', marginTop: '10px' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">ETH Address</InputLabel>
            <OutlinedInput
              readOnly
              value={User.user.ethaddress}
              id="outlined-adornment-ethaddress"
              label="ETH Address"
            />
            <FormHelperText>The ETH address you linked.</FormHelperText>
          </FormControl>
          {/* Fob ID field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '40px' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Fob Number</InputLabel>
            <OutlinedInput readOnly type="number" id="input-fobid" value={User.user.fobId} label="Fob Number" />
            <FormHelperText>The number on your fob</FormHelperText>
          </FormControl>
          {/* Months active field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '40px' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Months active</InputLabel>
            <OutlinedInput
              readOnly
              type="number"
              id="input-fobid"
              value={User.user.monthsActive}
              label="Months active"
            />
            <FormHelperText>The consecutive months you have been an active member</FormHelperText>
          </FormControl>
          {/* Months active field */}
          <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }}>
            <InputLabel htmlFor="outlined-adornment-ethaddress">Credit balance</InputLabel>
            <OutlinedInput readOnly type="number" id="input-fobid" value={User.user.credits} label="Credit balance" />
            <FormHelperText>Your credit balance</FormHelperText>
          </FormControl>
        </CardContent>
        <Divider />
        <CardContent>{displayBadges(User.user.badges)}</CardContent>
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
