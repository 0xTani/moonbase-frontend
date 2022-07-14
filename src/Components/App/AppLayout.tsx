import { TopNavBar } from './TopNavBar';
import { useUser } from 'src/Hooks/useUser';
import Sidebar from './Sidebar';
import { FC, ReactNode } from 'react';
import { Grid } from '@mui/material';

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const User = useUser();

  return (
    <>
      <TopNavBar />
      {!!User.user.username ? <Sidebar /> : ''}
      {children}
    </>
  );
};

export default AppLayout;
