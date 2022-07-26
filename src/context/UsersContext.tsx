import feathersClient from 'client';
import React, { createContext } from 'react';
import { FC, ReactNode } from 'react';
import { isDev } from 'src/Types/helpers';
import { IUser } from 'src/Types/TUser';

export interface IUsersContext {
  users: Array<IUser>;
  setUser: (user: IUser) => void;
  clearUsers: () => void;
  fetchUsers: () => void;
}

export const UsersContext = createContext<IUsersContext>({
  users: [],
  setUser: (user: IUser) => {},
  clearUsers: () => {},
  fetchUsers: () => {},
});

function indexOfUser(users: IUser[], user: IUser): number {
  let index = -1;

  users.forEach((element: IUser, i: number) => {
    if (element.id === user.id) index = i;
  });

  return index;
}

export const UsersProvider: FC<{ children: ReactNode }> = props => {
  function setUser(user: IUser) {
    console.warn('set users in file');
    let usersArray = [...users];
    if (isDev) console.log('indexOfUser ', indexOfUser(users, user));
    setUsers(usersArray);
  }

  function fetchUsers() {
    console.warn('fetch users in file');
    feathersClient
      .service('users')
      .find()
      .then((users: any) => {
        if (isDev) console.log(users.data);
        setUsers(users.data);
      });
  }

  function clearUsers() {
    setUsers([]);
  }

  const [users, setUsers] = React.useState<IUser[]>([]);

  return (
    <UsersContext.Provider value={{ users, setUser, clearUsers, fetchUsers }}>{props.children}</UsersContext.Provider>
  );
};
