import { UserContext } from 'src/context/UserContext';
import { useContext } from 'react';

export const useUser = () => {
  const userContext = useContext(UserContext);
  return userContext;
};
