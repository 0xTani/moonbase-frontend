import { TopNavBar } from './TopNavBar';
import { useUser } from 'src/Hooks/useUser';
import Sidebar from './Sidebar';
import { FC, ReactNode, useEffect } from 'react';
import feathersClient from 'client';
import { useRouter } from 'next/router';
import { IUser } from 'src/Types/TUser';
import { isDev } from 'src/Types/helpers';
import { useUsers } from 'src/Hooks/useUsers';

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const User = useUser();
  const Users = useUsers();
  const router = useRouter();
  // re authenticates user on window reload
  let isLoaded = false;

  useEffect(() => {
    if (!isLoaded) {
      window.addEventListener('load', function () {
        if (isDev) console.log('load app layout');
        feathersClient
          .authenticate()
          .then(result => {
            isDev && false ? console.log('authentication set', result.user) : '';
            feathersClient
              .service('users')
              .get(result.user.id)
              .then((user: IUser) => {
                User.setUser!(user);
              });
            Users.fetchUsers('app layout');
            User.setAuthentication!(result.authentication);
          })
          .catch(e => {
            router.push('/');
          });
      });
      isLoaded = true;
    }
  });

  return (
    <>
      <TopNavBar />
      {!!User.user.username ? <Sidebar /> : ''}
      {children}
    </>
  );
};

export default AppLayout;
