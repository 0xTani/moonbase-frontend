import { UsersContext } from 'src/context/UsersContext';
import { useContext } from 'react';

export const useUsers = () => {
  return useContext(UsersContext);
};
