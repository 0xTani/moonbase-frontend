import { Box, Button, Card, CardContent, Grid, Link } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';

import { useAccount, useProvider, useSigner } from 'wagmi';
import NFT from 'src/abi/MyEpicNFT.json';
import { Contract } from 'ethers';
import { useUser } from 'src/Hooks/useUser';
import axios from 'axios';
import { MEMBERCARD_DATA_DEFAULT } from 'src/context/UserContext';

const CONTRACT_ADDRESS = '0x3884D4dC882dD69173F1938f65a849f4aB5B2adc';

const Users: NextPage = () => {
  const User = useUser();
  const signer = useSigner();
  const account = useAccount();
  const provider = useProvider();

  const [nftId, setNftId] = React.useState<number>(-1);
  const [displayMint, setDisplayMint] = React.useState<boolean>(false);

  async function mintIt() {
    if (!signer.data) return;
    const ct = new Contract(CONTRACT_ADDRESS, NFT.abi, signer.data);
    const response = await ct.mintMoonbaseNFT(`${User.user.id}`);

    if (!response.wait) return;
    response.wait().then(() => {
      setDisplayMint(false);
      loadNFTs();
    });
  }

  async function loadNFTs() {
    // if (isDev) console.log('balanceof ', User.membercardData);

    if (!signer.data) return;
    try {
      const ct = new Contract(CONTRACT_ADDRESS, NFT.abi, provider);

      const balance = await ct.balanceOf(account.address);

      if (balance > 0) {
        setDisplayMint(false);
        const tokenId = await ct.tokenOfOwnerByIndex(account.address, 0);
        const tokenUriUrl = await ct.tokenURI(tokenId);
        const tokenUriJson = await (await axios.get(tokenUriUrl)).data;
        User.setMembercardData!({
          id: tokenId,
          tokenUriUrl,
          tokenUriJson,
        });

        setNftId(tokenId);
      } else setDisplayMint(true);
    } catch (error) {
      console.warn(error);
    }
  }
  // @TODO cleanup the 3-4 passes with better event handling
  useEffect(() => {
    if (account.address && User.membercardData.tokenUriUrl === '') {
      // if (isDev) console.log('membership: loadNFTs() fired');
      loadNFTs();
    }

    if (!account.isConnected) {
      User.setMembercardData!(MEMBERCARD_DATA_DEFAULT);
    }
  }, [account]);

  function BigButton() {
    let button = <></>;
    if (account.address) {
      if (User.membercardData.tokenUriUrl === '') {
        if (displayMint) {
          button = (
            <Button variant="contained" onClick={() => mintIt()}>
              Mint it!
            </Button>
          );
        } else {
          button = <LoadingButton loading>Loading</LoadingButton>;
        }
      } else {
        button = (
          <Button
            variant="contained"
            href={`https://testnet.rarible.com/token/${CONTRACT_ADDRESS}:${nftId}?tab=details`}
            target="_blank"
          >
            View on Rarible
          </Button>
        );
      }
    } else {
      button = (
        <CardContent>
          <Box sx={{ height: '36.5px' }}> Please connect to display Rarible link </Box>
        </CardContent>
      );
    }

    return (
      <CardContent>
        <Box sx={{ height: '36.5px' }}>{button}</Box>
      </CardContent>
    );
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
              {User.user.id ? (
                <CardContent>
                  <img src={`http://localhost:3030/getpfp?id=${User.user.id}`}></img>
                </CardContent>
              ) : (
                // @todo add loading image for cleaner experience
                ''
              )}
              {BigButton()}
            </Card>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Users;
