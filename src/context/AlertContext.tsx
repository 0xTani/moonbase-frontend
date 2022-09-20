import { AlertColor } from '@mui/material/Alert';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
export interface IAlert {
  duration: number;
  showing: boolean;
  body: string;
  severity: AlertColor;
}
const DEFAULT_ALERT: IAlert = { showing: false, body: '', severity: 'error', duration: 5000 };
export interface IAlertContext {
  alert: IAlert;
  setShowing: (isShowing: boolean) => void;
  toggleAlert: (alertIn: IAlert) => void;
}
export const AlertContext = createContext<IAlertContext>({
  alert: DEFAULT_ALERT,
  setShowing: (isShowing: boolean) => {},
  toggleAlert: (alertIn: IAlert) => {},
});

export const AlertProvider: FC<{ children: ReactNode }> = props => {
  const [alert, setAlert] = React.useState<IAlert>(DEFAULT_ALERT);

  function toggleAlert(alertIn: IAlert) {
    setAlert(alertIn);
    setTimeout(() => {
      setAlert(DEFAULT_ALERT);
    }, alertIn.duration);
  }
  function setShowing(isShowing: boolean) {
    setAlert({ ...alert, showing: isShowing });
  }
  return <AlertContext.Provider value={{ alert, setShowing, toggleAlert }}>{props.children}</AlertContext.Provider>;
};
