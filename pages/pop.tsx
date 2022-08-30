import { Button, Card, CardContent, Grid } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
const Pop: NextPage = () => {
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
          sx={{ minHeight: '100vh', textAlign: 'center' }}
        >
          <Grid item md={4}>
            <Card sx={{ minHeight: '400px' }}>
              <CardContent>
                <Button sx={{ margin: '10px 10px 10px 10px' }} variant={'contained'}>
                  POP 1
                </Button>
                <Button sx={{ margin: '10px 10px 10px 10px' }} variant={'contained'}>
                  POP 2
                </Button>
                <Button sx={{ margin: '10px 10px 10px 10px' }} variant={'contained'}>
                  POP 3
                </Button>
                <Button sx={{ margin: '10px 10px 10px 10px' }} variant={'contained'}>
                  POP 4
                </Button>
                <Button sx={{ margin: '10px 10px 10px 10px' }} variant={'contained'}>
                  POP 5
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Pop;
