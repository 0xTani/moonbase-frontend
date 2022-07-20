import { Button, Card, CardContent, Grid, Link } from '@mui/material';
import Head from 'next/head';
import { FC, useEffect } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';
import NFT from 'src/abi/MyEpicNFT.json';
import { Contract } from 'ethers';
import { useUser } from 'src/Hooks/useUser';
import React from 'react';

const CONTRACT_ADDRESS = '0x3884D4dC882dD69173F1938f65a849f4aB5B2adc';

const MembershipCard: FC = () => {
  const User = useUser();
  const signer = useSigner();
  const account = useAccount();
  const provider = useProvider();
  console.log(account.address);

  const [hasNft, setHasNft] = React.useState<boolean>(true);
  const [nftId, setNftId] = React.useState<number>(-1);

  async function mintIt() {
    if (!signer.data) return;
    const ct = new Contract(CONTRACT_ADDRESS, NFT.abi, signer.data);
    const response = await ct.mintMoonbaseNFT(`${User.user.id}`);

    if (!response.wait) return;
    const transactionResponse = await response.wait();
    console.log(response);
    console.log(transactionResponse);
  }

  useEffect(() => {
    async function balanceOf() {
      if (!signer.data) return;
      try {
        const ct = new Contract(CONTRACT_ADDRESS, NFT.abi, provider);
        console.log('address', account.address);
        const balance = await ct.balanceOf(account.address);
        console.log(balance > 0);
        setHasNft(balance > 0);
        const tokenId = await ct.tokenOfOwnerByIndex(account.address, 0);
        setNftId(tokenId);
      } catch (error) {
        console.warn(error);
      }
    }
    if (account.address) balanceOf();
  }, [account.address]);

  async function displayNfts() {
    if (!signer.data) return;
    try {
      const ct = new Contract(CONTRACT_ADDRESS, NFT.abi, provider);
      console.log('address', account.address);
      const balance = await ct.balanceOf(account.address);
      const array = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await ct.tokenOfOwnerByIndex(account.address, i);
        const uri = await ct.tokenURI(tokenId);
        array.push(tokenId);
      }
      console.log(array);
      return array;
    } catch (error) {
      console.warn(error);
    }
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
                {!hasNft && account.address ? (
                  <Button onClick={mintIt} variant="contained" color="secondary">
                    ⛏ Mint it!
                  </Button>
                ) : (
                  <Link href={`https://testnet.rarible.com/token/${CONTRACT_ADDRESS}:${nftId}?tab=details`}>
                    View on Rarible
                  </Link>
                )}
              </CardContent>

              <CardContent>
                <Button onClick={displayNfts}>Display it!</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default MembershipCard;
