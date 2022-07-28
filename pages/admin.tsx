import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import feathersClient from 'client';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { useUsers } from 'src/Hooks/useUsers';
import { DEFAULT_NEW_USER_FORM } from 'src/Types/Constants';
import { capitalizeFirst } from 'src/Types/helpers';
import { IBadgeDisplay, INewUserForm } from 'src/Types/TUser';

const Admin: NextPage = () => {
  const Users = useUsers();

  function badgeClicked(badge: IBadgeDisplay, userBadgesString: string, userId: number) {
    let newUserBadges = JSON.parse(userBadgesString);
    if (badge.isEquipped) {
      newUserBadges = newUserBadges.filter((b: number) => b !== badge.id);
    } else {
      newUserBadges.push(badge.id);
      newUserBadges.sort();
    }
    feathersClient.service('users').patch(userId, { badges: newUserBadges });
  }

  function activeClicked(userId: number, newActive: boolean) {
    feathersClient.service('users').patch(userId, { active: newActive });
  }

  function displayBadges(userBadgesString: string, userId: number) {
    return Users.getBadgesAdmin(userBadgesString).map((badge, i: number) => (
      <Button
        key={i}
        onClick={() => {
          badgeClicked(badge, userBadgesString, userId);
        }}
        variant="outlined"
        size="small"
        color={badge.color}
        sx={{ marginLeft: '10px', opacity: badge.isEquipped ? '1' : '0.4' }}
      >
        {badge.name}
      </Button>
    ));
  }

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
                    <TableRow
                      key={user.id + user.fobId! + Math.floor(Math.random())}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {capitalizeFirst(user.username)}
                      </TableCell>
                      <TableCell align="center">
                        {user.active === 1 ? (
                          <Button
                            variant={'outlined'}
                            color="success"
                            size={'small'}
                            onClick={() => {
                              activeClicked(user.id, false);
                            }}
                          >
                            Active
                          </Button>
                        ) : (
                          <Button
                            variant={'outlined'}
                            size={'small'}
                            sx={{ opacity: 0.4 }}
                            onClick={() => {
                              activeClicked(user.id, true);
                            }}
                          >
                            Inactive
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="left">{displayBadges(user.badges, user.id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Admin;
