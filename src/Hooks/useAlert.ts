import { AlertContext } from 'src/context/AlertContext';
import { useContext } from 'react';
export const useAlertContext = () => {
  return useContext(AlertContext);
};
