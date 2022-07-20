import { Button } from '@mui/material';
import feathersClient from 'client';
import { useUser } from 'src/Hooks/useUser';
import { useEffect } from 'react';
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

function addressShorten(address: string | undefined) {
  if (address) {
    const REGEX_ADDRESSIFY = /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    const match = address.match(REGEX_ADDRESSIFY);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  } else return undefined;
}

export function AccountButton() {
  const User = useUser();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  function patchEthAddress(ethaddress: string) {
    feathersClient
      .service('users')
      .patch(User.user.id, { ethaddress: ethaddress })
      .then((r: any) => {
        User.setUser!(r);
      })
      .catch((e: any) => console.error(e));
  }

  function clickConnect() {
    connect();
  }

  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (address) {
      if (User.user.ethaddress === '') {
        // address empty, links it
        patchEthAddress(address ? address : '');
      } else if (User.user.ethaddress !== address) {
        // @todo patches eth address after web3 user connection, should change to manual / prompt
        patchEthAddress(address ? address : '');
      }
    }
  }, [address]);

  if (isConnected) {
    return (
      <Button variant="contained" onClick={() => disconnect()}>
        {ensName ?? addressShorten(address)}
      </Button>
    );
  }

  return (
    <Button variant="contained" onClick={clickConnect}>
      Connect Wallet
    </Button>
  );
}
