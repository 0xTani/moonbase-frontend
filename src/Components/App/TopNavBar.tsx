import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useUser } from 'src/Hooks/useUser';
import { AccountButton } from './AccountButton';

export function TopNavBar() {
  const User = useUser();
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003162' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MoonBase Station
        </Typography>
        {User.isAuthenticated ? (
          <>
            <Button variant="contained" sx={{ marginRight: '20px' }} onClick={User.logout}>
              Logout
            </Button>
            <AccountButton />
          </>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
}
