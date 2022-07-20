import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import feathersClient from 'client';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { capitalizeFirst } from 'src/Types/helpers';
import { IUser } from 'src/Types/TUser';

const Users: NextPage = () => {

    const [users, setUsers] = React.useState(new Array<IUser>)
  function fetchUsers() {
    feathersClient.service('users').find().then((users:any)=>{
        console.log(users)
        setUsers(users.data) 
    })
  }

  useEffect(()=>fetchUsers())
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
          sx={{ minHeight: '100vh', textAlign: 'center',paddingLeft: '250px' }}
        >
            <Grid item md={8}>
            <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Twitter</TableCell>
                    <TableCell align="center">Telegram</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                         {capitalizeFirst(user.username)}
                        </TableCell>
                        <TableCell align="center">{user.active === 1 ? (
                          <Button variant={'outlined'} color="success" size={'small'} >
                            Active
                          </Button>
                          ) : (
                          <Button variant={'outlined'} size={'small'}  disabled>
                            Inactive
                          </Button>
                    )}</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
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

export default Users;
