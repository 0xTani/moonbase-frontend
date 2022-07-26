import { UserContext } from 'src/context/UserContext';
import { useContext } from 'react';

export const useUser = () => {
  return useContext(UserContext);
};
