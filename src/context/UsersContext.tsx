import feathersClient from 'client';
import React, { createContext } from 'react';
import { FC, ReactNode } from 'react';
import { isDev } from 'src/Types/helpers';
import { IBadge, IUser } from 'src/Types/TUser';

export interface IUsersContext {
  users: Array<IUser>;
  setUser: (user: IUser) => void;
  clearUsers: () => void;
  fetchUsers: () => void;
  getUserBadges: (badgeIdArray: string) => Array<IBadge>;
}

export const UsersContext = createContext<IUsersContext>({
  users: [],
  setUser: (user: IUser) => {},
  clearUsers: () => {},
  fetchUsers: () => {},
  getUserBadges: (badgeIdArray: string) => [],
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
  function getUserBadges(badgeIdString: string): Array<IBadge> {
    let formattedBadges: Array<IBadge> = [];
    const badgeIdArray = JSON.parse(badgeIdString);
    console.log('badgeIdArray');
    console.log(badgeIdArray);
    console.log(badgeIdArray.length);
    if (badgeIdArray.length > 0) {
      badges.forEach(badge => {
        badgeIdArray.forEach((badgeId: number) => {
          if (badgeId === badge.id) formattedBadges.push(badge);
        });
      });
    }
    return formattedBadges;
  }

  function fetchUsers() {
    if (isDev) console.warn('fetch users in file');
    feathersClient
      .service('badge')
      .find()
      .then((badges: any) => {
        if (isDev) console.log('badges fetched ', badges.data);
        setBadges(badges.data);
        feathersClient
          .service('users')
          .find()
          .then((users: any) => {
            if (isDev) console.log('users fetched ', users.data);
            setUsers(users.data);
          });
      });
  }

  function clearUsers() {
    setUsers([]);
  }

  const [users, setUsers] = React.useState<IUser[]>([]);
  const [badges, setBadges] = React.useState<IBadge[]>([]);

  return (
    <UsersContext.Provider value={{ users, setUser, clearUsers, fetchUsers, getUserBadges }}>
      {props.children}
    </UsersContext.Provider>
  );
};
