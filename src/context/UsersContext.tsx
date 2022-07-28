import feathersClient from 'client';
import React, { createContext, useEffect } from 'react';
import { FC, ReactNode } from 'react';
import { useUser } from 'src/Hooks/useUser';
import { useUsers } from 'src/Hooks/useUsers';
import { DEFAULT_USER } from 'src/Types/Constants';
import { isDev } from 'src/Types/helpers';
import { IBadge, IBadgeDisplay, IUser } from 'src/Types/TUser';

export interface IUsersContext {
  users: Array<IUser>;
  setUser: (user: IUser) => void;
  clearUsers: () => void;
  fetchUsers: (from: string) => void;
  getUserBadges: (badgeIdArray: string) => Array<IBadge>;
  getBadgesAdmin: (badgeIdArray: string) => Array<IBadgeDisplay>;
}

export function isUserIdInArray(id: number, badgeIdJsonString: string) {
  const badgeIdArray = JSON.parse(badgeIdJsonString);
  try {
    return badgeIdArray.filter((badgeId: number) => badgeId === id).length > 0;
  } catch (error) {
    return false;
  }
}

export const UsersContext = createContext<IUsersContext>({
  users: [],
  setUser: (user: IUser) => {},
  clearUsers: () => {},
  fetchUsers: (from: string) => {},
  getUserBadges: (badgeIdArray: string) => [],
  getBadgesAdmin: (badgeIdArray: string) => [],
});

function indexOfUser(users: IUser[], user: IUser): number {
  let index = -1;
  if (users.length > 0) {
    for (let i = 0; i < users.length - 1; i++) {
      if (users[i].id === user.id) {
        index = i;
      }
    }
  }

  return index;
}

export const UsersProvider: FC<{ children: ReactNode }> = props => {
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [badges, setBadges] = React.useState<IBadge[]>([]);

  //   useEffect(() => {
  //     console.warn('there is no god', users);
  //   }, [users]);

  function setUser(user: IUser) {
    let usersArray = [...users];
    if (isDev) console.log('indexOfUser ', indexOfUser(users, user));
    console.log(users);
    if (users.length > 0) {
      console.log(typeof user.id);
      console.log(typeof users[0].id);
      for (let i = 0; i < users.length - 1; i++) {
        if (users[i].id === user.id) {
          usersArray[i] = user;
        }
      }
    }
    setUsers(usersArray);
  }

  //   todo optimize
  function getBadgesAdmin(badgeIdJsonString: string): Array<IBadgeDisplay> {
    let formattedBadges: Array<IBadgeDisplay> = [];
    badges.forEach(badge => {
      let displayBadge: IBadgeDisplay = {
        id: badge.id,
        color: badge.color,
        definition: badge.definition,
        isEquipped: isUserIdInArray(badge.id, badgeIdJsonString),
        maxUsers: badge.maxUsers,
        name: badge.name,
      };
      formattedBadges.push(displayBadge);
    });
    return formattedBadges;
  }

  function getUserBadges(badgeIdJsonString: string): Array<IBadge> {
    let formattedBadges: Array<IBadge> = [];
    const badgeIdArray = JSON.parse(badgeIdJsonString);
    if (badgeIdArray && badgeIdArray.length > 0) {
      badges.forEach(badge => {
        try {
          badgeIdArray.forEach((badgeId: number) => {
            if (badgeId === badge.id) formattedBadges.push(badge);
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
    return formattedBadges;
  }

  function setUser2(user: IUser) {
    const a: IUser[] = [DEFAULT_USER, DEFAULT_USER];

    console.log(
      a.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.id]: cur,
        }),
        {},
      ),
    );

    feathersClient
      .service('users')
      .find()
      .then((userz: any) => {
        setUsers(userz.data);
      });
  }

  let usersPatchedListener: any = null;
  let usersCreatedListener: any = null;

  //   @todo patch individual user
  function setListeners() {
    console.log('setListeners users', users);
    if (!usersPatchedListener)
      usersPatchedListener = feathersClient.service('users').on('patched', (user: IUser) => {
        setUser2(user);
      });

    if (!usersCreatedListener)
      usersCreatedListener = feathersClient.service('users').on('created', (user: IUser) => {
        // setUser(user)
        setUser2(user);
      });
  }

  function fetchUsers(from: string) {
    if (isDev) console.log('users fetched ', from);

    feathersClient
      .service('badge')
      .find()
      .then((badges: any) => {
        setBadges(badges.data);
        feathersClient
          .service('users')
          .find()
          .then((users: any) => {
            setUsers(users.data);
            setListeners();
          });
      });
  }

  function clearUsers() {
    setUsers([]);
  }

  return (
    <UsersContext.Provider value={{ users, setUser, clearUsers, fetchUsers, getUserBadges, getBadgesAdmin }}>
      {props.children}
    </UsersContext.Provider>
  );
};
