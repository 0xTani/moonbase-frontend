import { Button, Card, CardContent, Grid } from '@mui/material';
import Head from 'next/head';
import { FC } from 'react';
import { useSigner } from 'wagmi';
import NFT from 'src/abi/MyEpicNFT.json';
import { Contract } from 'ethers';
import { useUser } from 'src/Hooks/useUser';

const MembershipCard: FC = () => {
  const User = useUser();
  const signer = useSigner();
  async function mintIt() {
    if (!signer.data) return;
    const ct = new Contract('0x046C912Af38b830dB75Fc6B5D950909043807423', NFT.abi, signer.data);
    const response = await ct.makeAnEpicNFT();

    if (!response.wait) return;
    const transactionResponse = await response.wait();
    console.log(response);
    console.log(transactionResponse);
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
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ minHeight: '100vh', textAlign: 'center' }}
        >
          <Grid item md={4}>
            <Card>
              <CardContent>
                <img crossOrigin="anonymous" src={`http://localhost:3030/getpfp?id=${User.user.id}`}></img>
              </CardContent>
              <CardContent>
                <Button onClick={mintIt} variant="contained" color="secondary">
                  ⛏ Mint it!
                </Button>
              </CardContent>
            </Card>
          </Grid>{' '}
        </Grid>
      </main>
    </>
  );
};

export default MembershipCard;
