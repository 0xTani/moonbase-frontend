import { ethers } from 'ethers';
import { chain, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// @todo setup more providers and add them in configureChains (infura alchemy)

export const defaultChains = [chain.mainnet, chain.rinkeby, chain.polygon];

export const { chains, provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

export const wagmiClient = createClient({
  provider,
  connectors: [
    new InjectedConnector({ chains }),
    // doesnt work
    // new MetaMaskConnector({ chains }),
  ],
});

// // unsupported network

// // network change

// // connect

// // disconnect

// export const wagmiClient = createClient({
//   autoConnect: true,
//   provider,
//   webSocketProvider,
// });
