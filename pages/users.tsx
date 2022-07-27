import {
  Button,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import feathersClient from 'client';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useUsers } from 'src/Hooks/useUsers';
import { capitalizeFirst } from 'src/Types/helpers';

const Users: NextPage = () => {
  const Users = useUsers();

  useEffect(() => {
    window.addEventListener('load', function () {
      console.log('calledddddddddddddddddddddd');
      Users.fetchUsers();
    });
  });

  function displayBadges(userBadgesString: string) {
    return Users.getUserBadges(userBadgesString).map(b => (
      <Button variant="outlined" size="small" color={b.color} sx={{ marginLeft: '10px' }}>
        {b.name}
      </Button>
    ));
  }

  function patchUser() {
    feathersClient.service('users').patch(3, { badges: [2, 6] });
    console.log('users.tsx: ', Users.users);
  }
  function patchUser1() {
    feathersClient.service('users').patch(3, { badges: [1, 2, 6] });
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

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
          justifyContent={'center'}
          sx={{
            minHeight: 'calc(100vh - 64px)',
            textAlign: 'center',
            paddingLeft: '250px',
            marginTop: '64px',
            paddingTop: '30px',
            paddingBottom: '30px',
          }}
        >
          <Grid item md={8} lg={10} xl={11}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Twitter</TableCell>
                    <TableCell align="center">Telegram</TableCell>
                    <TableCell align="left">Badges</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Users.users.map(user => (
                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {capitalizeFirst(user.username)}
                      </TableCell>
                      <TableCell align="center">
                        {user.active === 1 ? (
                          <Button variant={'outlined'} color="success" size={'small'}>
                            Active
                          </Button>
                        ) : (
                          <Button variant={'outlined'} size={'small'} disabled>
                            Inactive
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="left">{displayBadges(user.badges)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={patchUser1}> Patch user 1 2 6</Button>
            <Button onClick={patchUser}> Patch user 2 6</Button>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Users;
