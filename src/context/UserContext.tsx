import feathersClient from 'client';
import { useRouter } from 'next/router';
import React from 'react';
import { createContext, FC, ReactNode } from 'react';
import { useUsers } from 'src/Hooks/useUsers';
import { DEFAULT_AUTHENTICATION as AUTHENTICATION_DEFAULT, DEFAULT_USER } from 'src/Types/Constants';
import { arrayStringParse } from 'src/Types/helpers';
import { IAuthentication, IMembercardData, IUser } from 'src/Types/TUser';

export const MEMBERCARD_DATA_DEFAULT: IMembercardData = {
  id: null,
  tokenUriUrl: '',
  tokenUriJson: null,
};

export interface IUserContext {
  user: IUser;
  setUser?: React.Dispatch<React.SetStateAction<IUser>>;
  authentication: IAuthentication;
  setAuthentication?: React.Dispatch<React.SetStateAction<IAuthentication>>;
  membercardData: IMembercardData;
  setMembercardData?: React.Dispatch<React.SetStateAction<IMembercardData>>;
  isAuthenticated: boolean;
  logout: () => void;
  organizationChecked: (organizationId: number, currentChecked: boolean) => void;
  initUser: (user: IUser) => void;
}

export const UserContext = createContext<IUserContext>({
  user: DEFAULT_USER,
  authentication: AUTHENTICATION_DEFAULT,
  isAuthenticated: false,
  membercardData: MEMBERCARD_DATA_DEFAULT,
  organizationChecked: (organizationId: number, currentChecked: boolean) => {},
  logout: () => {},
  initUser: (user: IUser) => {},
});

export const UserProvider: FC<{ children: ReactNode }> = props => {
  const Users = useUsers();
  const router = useRouter();

  let usersPatchedListener = false;
  function setListeners() {
    if (!usersPatchedListener) {
      feathersClient.service('users').on('patched', (user: IUser) => {
        fetchUser();
      });
      usersPatchedListener = true;
    }
  }

  // @todo change that
  function fetchUser() {
    feathersClient.get('authentication').then((u: any) => {
      feathersClient
        .service('users')
        .get(u.user.id)
        .then((user: IUser) => setUser(user));
    });
  }

  function initUser(user: IUser) {
    console.log('init userrr');
    setUser(user);
    setListeners();
  }

  function logout() {
    feathersClient.logout().then(() => {
      setAuthentication(AUTHENTICATION_DEFAULT);
      setUser(DEFAULT_USER);
      Users.clearUsers();
      router.push('/');
    });
  }

  function organizationChecked(organizationId: number, currentSelected: boolean) {
    let selectedArray = arrayStringParse(user.organizationsSelected);
    if (currentSelected) {
      selectedArray.splice(selectedArray.indexOf(organizationId), 1);
    } else {
      selectedArray.push(organizationId);
    }
    selectedArray.sort();
    feathersClient.service('users').patch(user.id, { organizationsSelected: selectedArray });
  }

  const [user, setUser] = React.useState<IUser>(DEFAULT_USER);
  const [authentication, setAuthentication] = React.useState<IAuthentication>(AUTHENTICATION_DEFAULT);
  const [membercardData, setMembercardData] = React.useState<IMembercardData>(MEMBERCARD_DATA_DEFAULT);

  // dev only
  // useEffect(() => {
  //   if (isDev) console.log('user modified in context', user);
  // }, [user]);

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
        initUser,
        organizationChecked,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
