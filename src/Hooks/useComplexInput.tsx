import React from 'react';
interface IComplexInputProps {
  initialValue: string;
  sideEffect?: () => void;
  validate: (value: string) => boolean;
}

interface IComplexInputHook {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isValid: boolean;
}

interface IErrorInput {
  error: boolean;
  message?: string;
}

export const useComplexInput = (props: IComplexInputProps) => {
  const [value, setValue] = React.useState<string>('');
  const [error, setError] = React.useState<IErrorInput>({ error: false, message: '' });

  const isValid = props.validate(value);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (props.validate !== null) {
      if (props.validate(e.target.value)) setValue(e.target.value);
    } else setValue(e.target.value);
  }
  function getFieldProps() {
    return {
      value,
      onChange,
      isValid,
    };
  }
  const complexInput: IComplexInputHook = { value, onChange, isValid };
  return complexInput;
};
