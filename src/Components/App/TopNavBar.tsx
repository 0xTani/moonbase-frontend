import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useUser } from 'src/Hooks/useUser';
import { useNetwork } from 'wagmi';
import { AccountButton } from './AccountButton';

export function TopNavBar() {
  const User = useUser();
  const router = useRouter();
  const network = useNetwork();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003162' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button onClick={() => router.push('/')} variant="text">
            YVR HUB
          </Button>
        </Box>

        <Button
          disableTouchRipple
          sx={{
            marginRight: '20px',
            cursor: 'default',
            '&:hover': { backgroundColor: 'transparent' },
            '&:active': { backgroundColor: 'transparent' },
          }}
        >
          {network.chain?.name ?? 'Not connected'}
        </Button>
        {User.isAuthenticated ? (
          <>
            <Button variant="contained" sx={{ marginRight: '20px' }} onClick={User.logout}>
              Logout
            </Button>
            <AccountButton />
          </>
        ) : (
          ''
        )}
      </Toolbar>
    </AppBar>
  );
}
