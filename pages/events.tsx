import { Grid } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Calendar from 'src/Components/Calendar';

const Events: NextPage = () => {
  return (
    <>
      <Head>
        <title>Events</title>
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
            <Calendar />
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Events;
