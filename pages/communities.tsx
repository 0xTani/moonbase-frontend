import { Button, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { IOrganization } from 'src/context/OrganizationContext';
import { useOrganization } from 'src/Hooks/useOrganization';
const Organization: NextPage = () => {
  const Organizations = useOrganization();
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid
          container
          justifyContent={'center'}
          sx={{
            minHeight: 'calc(100vh - 64px)',
            textAlign: 'left',
            paddingLeft: '250px',
            marginTop: '64px',
            paddingTop: '30px',
            paddingBottom: '30px',
          }}
        >
          <Grid item md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="#ccc">
                  Vancouver's communities
                </Typography>
                <Grid item md={8} lg={10} xl={11} sx={{ marginTop: '1rem' }}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead sx={{ backgroundColor: '#333' }}>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="left">City</TableCell>
                          <TableCell align="left">Description</TableCell>
                          <TableCell align="left">Telegram</TableCell>
                          <TableCell align="left">Discord</TableCell>
                          <TableCell align="left">Join</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Organizations.organizations.map((organization: IOrganization) => {
                          return (
                            <TableRow>
                              <TableCell>{organization.name}</TableCell>
                              <TableCell align="left">Vancouver</TableCell>
                              <TableCell align="left">{organization.description}</TableCell>
                              <TableCell align="left">{organization.telegramGroup}</TableCell>
                              <TableCell align="left">{organization.discord}</TableCell>
                              <TableCell align="left">
                                <Button variant="contained">Join</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </>
  );
};
export default Organization;
