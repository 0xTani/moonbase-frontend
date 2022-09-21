import { Button, FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import React, { FC } from 'react';
import { useComplexInput } from 'src/Hooks/useComplexInput';

interface IComplexInputProps {
  initialValue: string;
  label: string;
  helper: string;
  validate?: (value: string) => boolean;
}

export const ComplexInputField: FC<IComplexInputProps> = (props: IComplexInputProps) => {
  const complexInput = useComplexInput({
    validate: props.validate
      ? props.validate
      : (value: string) => {
          return true;
        },
    initialValue: props.initialValue,
  });
  const { onChange, value, isValid } = complexInput;

  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '3rem' }}>
      <InputLabel htmlFor="outlined-adornment-ethaddress">{props.label}</InputLabel>
      <OutlinedInput
        id="input-label"
        value={value}
        error={!isValid}
        onChange={onChange}
        // endAdornment={
        //   <InputAdornment position="end">
        //     <Button disabled={User.user.fobId === values.fobId} color="warning" variant="outlined" onClick={saveFobId} sx={{ paddingLeft: '8px', paddingRight: '10px' }}>
        //       💾 Save
        //     </Button>
        //   </InputAdornment>
        // }
        label={props.label}
      />
      <FormHelperText>{props.helper}</FormHelperText>
    </FormControl>
  );
};
