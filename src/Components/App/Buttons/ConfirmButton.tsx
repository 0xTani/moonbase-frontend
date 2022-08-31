import { Button, SxProps, Theme } from '@mui/material';
import React, { FC } from 'react';

interface ConfirmButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
  sx: SxProps<Theme>;
}

const ConfirmButton: FC<ConfirmButtonProps> = (props: ConfirmButtonProps) => {
  function click() {
    if (state) {
      props.onClick();
      setState(false);
    } else {
      setState(true);
      setTimeout(() => {
        setState(false);
      }, 3000);
    }
  }
  const [state, setState] = React.useState<boolean>(false);
  return (
    <Button
      onClick={click}
      color={props.color ? props.color : 'primary'}
      variant={props.variant ? props.variant : 'contained'}
      sx={{ minWidth: '123px', ...props.sx }}
    >
      {state ? 'Are you sure?' : props.text}
    </Button>
  );
};

export default ConfirmButton;
