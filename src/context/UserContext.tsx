import feathersClient from 'client';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { createContext, FC, ReactNode } from 'react';
import { DEFAULT_AUTHENTICATION, DEFAULT_USER } from 'src/Types/Constants';
import { IAuthentication, IUser } from 'src/Types/TUser';

interface IUserContext {
  user: IUser;
  setUser?: React.Dispatch<React.SetStateAction<IUser>>;
  authentication: IAuthentication;
  setAuthentication?: React.Dispatch<React.SetStateAction<IAuthentication>>;
  isAuthenticated: boolean;
  logout: () => void;
}

export const UserContext = createContext<IUserContext>({
  user: DEFAULT_USER,
  authentication: DEFAULT_AUTHENTICATION,
  isAuthenticated: false,
  logout: () => {},
});

export const UserProvider: FC<{ children: ReactNode }> = props => {
  function logout() {
    feathersClient.logout().then(() => {
      setAuthentication(DEFAULT_AUTHENTICATION);
      setUser(DEFAULT_USER);
    });
  }
  const [user, setUser] = React.useState<IUser>(DEFAULT_USER);
  const [authentication, setAuthentication] = React.useState<IAuthentication>(DEFAULT_AUTHENTICATION);

  useEffect(() => {
    console.log('user modified in context', user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, authentication, setAuthentication, isAuthenticated: !!user.username, logout }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
