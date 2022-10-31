import React from 'react';
import { NEXTPAGE_GRIDSTYLE } from 'src/styles/AppStyles';
import { Card, CardContent, Grid, CardHeader, Avatar, IconButton, Button, TextField, CardActions, Divider } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { sHelpers } from '~styles/HelperStyles';
const Bounties: NextPage = () => {
  const BountyCard = (
    <Grid item sm={4} sx={{ ...sHelpers.paddingX.remHalf }}>
      <Card>
        <CardHeader
          action={
            <Button aria-label="fsdfds" sx={{ '&:hover': { backgroundColor: 'transparent', cursor: 'default' } }} disableFocusRipple disableTouchRipple>
              0.05 ETH
            </Button>
          }
          subheader="Connect LED to Hub"
        />
        <Divider />
        <CardContent>
          <TextField
            sx={{ borderBottom: 'none' }}
            id=""
            label=""
            variant="standard"
            disabled
            multiline
            minRows={3}
            maxRows={3}
            fullWidth
            value={'Connect the street LED interface to the HUB. Could be an IFrame or serve the page to users.'}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained">Execute</Button>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid container justifyContent={'left'} alignContent={'flex-start'} sx={NEXTPAGE_GRIDSTYLE}>
          <Grid item sm={12} xs sx={{ ...sHelpers.marginBottom.rem2, ...sHelpers.paddingX.remHalf }}>
            <Card>
              <CardHeader action={<IconButton aria-label=""></IconButton>} title="Bounties 💰" />
              <CardContent>
                <Button variant="contained">Create bounty</Button>
              </CardContent>
            </Card>
          </Grid>
          {BountyCard}
          {BountyCard}
        </Grid>
      </main>
    </>
  );
};
export default Bounties;
