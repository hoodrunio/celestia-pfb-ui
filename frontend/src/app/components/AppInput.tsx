import { Box, TextField } from '@mui/material';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';

interface AppInputProps {
  placeholder?: string;
  label: string;
  formName: string;
  toolTipText?: string;
  required?: boolean;
  maxL?: number;
  disabled?: boolean;
  minL?: number;
  form: UseFormReturn<FieldValues, any>;
}

const AppInput = (props: AppInputProps) => {
  const {
    formName,
    placeholder,
    label,
    toolTipText,
    form,
    required = true,
    minL = 0,
    maxL = 100,
    disabled,
  } = props;

  return (
    <Box py={1.5} mx={1}>
      <Controller
        name={formName}
        defaultValue=""
        control={form.control}
        rules={{
          required: {
            value: required,
            message: `Field is required`,
          },
          minLength: {
            value: minL,
            message: `Minimum length is ${minL}`,
          },
          maxLength: {
            value: maxL,
            message: `Maximum length is ${maxL}`,
          },
        }}
        render={({ field, formState }) => {
          const error = formState?.errors[formName];
          const helperText = error?.message?.toString() ?? toolTipText;
          return (
            <TextField
              placeholder={placeholder}
              label={label}
              required
              disabled={disabled}
              helperText={helperText}
              error={!!error}
              {...field}
            />
          );
        }}
      />
    </Box>
  );
};

export default AppInput;
