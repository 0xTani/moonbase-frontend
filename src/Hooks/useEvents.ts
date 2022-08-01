import { EventContext } from 'src/context/EventContext';
import { useContext } from 'react';

export const useEvent = () => {
  return useContext(EventContext);
};
