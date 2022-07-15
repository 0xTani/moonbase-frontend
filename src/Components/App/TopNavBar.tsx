import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useUser } from 'src/Hooks/useUser';
import { AccountButton } from './AccountButton';

export function TopNavBar() {
  const User = useUser();
  const router = useRouter();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003162' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button onClick={() => router.push('/')} variant="text">
            Moonbase Station
          </Button>
        </Box>

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
