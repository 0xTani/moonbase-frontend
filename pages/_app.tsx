import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from 'styles/theme';
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from 'src/config/wagmiconfig';
import { UserProvider } from 'src/context/UserContext';
import { CssBaseline } from '@mui/material';
import AppLayout from 'src/Components/App/AppLayout';
import { UsersProvider } from 'src/context/UsersContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UsersProvider>
      <UserProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline>
            <WagmiConfig client={wagmiClient}>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </WagmiConfig>
          </CssBaseline>
        </ThemeProvider>
      </UserProvider>
    </UsersProvider>
  );
}

export default MyApp;
