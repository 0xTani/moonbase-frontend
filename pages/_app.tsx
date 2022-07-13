import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { darkTheme } from 'styles/theme';
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from 'src/config/wagmiconfig';
import { UserProvider } from 'src/context/UserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider theme={darkTheme}>
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
