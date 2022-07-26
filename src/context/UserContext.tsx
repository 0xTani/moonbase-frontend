import feathersClient from 'client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { createContext, FC, ReactNode } from 'react';
import { useUsers } from 'src/Hooks/useUsers';
import { DEFAULT_AUTHENTICATION as AUTHENTICATION_DEFAULT, DEFAULT_USER } from 'src/Types/Constants';
import { isDev } from 'src/Types/helpers';
import { IAuthentication, IMembercardData, IUser } from 'src/Types/TUser';

export interface IUserContext {
  user: IUser;
  setUser?: React.Dispatch<React.SetStateAction<IUser>>;
  authentication: IAuthentication;
  setAuthentication?: React.Dispatch<React.SetStateAction<IAuthentication>>;
  membercardData: IMembercardData;
  setMembercardData?: React.Dispatch<React.SetStateAction<IMembercardData>>;
  isAuthenticated: boolean;
  logout: () => void;
}

export const MEMBERCARD_DATA_DEFAULT: IMembercardData = {
  id: null,
  tokenUriUrl: '',
  tokenUriJson: null,
};

export const UserContext = createContext<IUserContext>({
  user: DEFAULT_USER,
  authentication: AUTHENTICATION_DEFAULT,
  isAuthenticated: false,
  membercardData: MEMBERCARD_DATA_DEFAULT,
  logout: () => {},
});

export const UserProvider: FC<{ children: ReactNode }> = props => {
  const Users = useUsers();
  const router = useRouter();
  function logout() {
    feathersClient.logout().then(() => {
      setAuthentication(AUTHENTICATION_DEFAULT);
      setUser(DEFAULT_USER);
      Users.clearUsers();
      router.push('/');
    });
  }
  const [user, setUser] = React.useState<IUser>(DEFAULT_USER);
  const [authentication, setAuthentication] = React.useState<IAuthentication>(AUTHENTICATION_DEFAULT);
  const [membercardData, setMembercardData] = React.useState<IMembercardData>(MEMBERCARD_DATA_DEFAULT);

  // dev only
  useEffect(() => {
    if (isDev) console.log('user modified in context', user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authentication,
        setAuthentication,
        isAuthenticated: !!user.username,
        logout,
        membercardData,
        setMembercardData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
