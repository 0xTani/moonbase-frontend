import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import Calendar from 'src/Components/Calendar';
import { IOrganizationSelected } from 'src/context/OrganizationContext';
import { useOrganization } from 'src/Hooks/useOrganization';
import { useUser } from 'src/Hooks/useUser';
import { arrayStringParse } from 'src/Types/helpers';

const Events: NextPage = () => {
  const Organization = useOrganization();
  const User = useUser();
  const isAdmin = true;

  const AdminModeToggle = () => {
    if (isAdmin) {
      return (
        <FormControlLabel
          control={<Checkbox />}
          sx={{
            userSelect: 'none',
            backgroundColor: 'green',
            paddingRight: '12px',
            marginRight: '35px',
            borderRadius: '5px',
            marginTop: '1rem',
          }}
          checked={Organization.adminMode}
          label="Admin mode"
          onChange={() => {
            Organization.setAdminMode(!Organization.adminMode);
          }}
        />
      );
    } else return <></>;
  };

  const OrganizationSelector = () => {
    const orgButtons = Organization.getOrganizationsSelected(
      arrayStringParse(User.user.organizations),
      arrayStringParse(User.user.organizationsSelected),
    ).map((og: IOrganizationSelected) => {
      return (
        <FormControlLabel
          control={<Checkbox />}
          sx={{
            userSelect: 'none',
            backgroundColor: og.backgroundColor,
            paddingRight: '12px',
            marginRight: '35px',
            borderRadius: '5px',
            marginTop: '1rem',
          }}
          checked={og.selected}
          label={og.name}
          onChange={() => {
            User.organizationChecked(parseInt(og.id), og.selected);
          }}
        />
      );
    });

    return (
      <Box>
        {AdminModeToggle()} {orgButtons}
      </Box>
    );
  };

  return (
    <>
      <Head>
        <title>Hub Events</title>
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
              <Calendar />
              {OrganizationSelector()}
            </>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Events;
