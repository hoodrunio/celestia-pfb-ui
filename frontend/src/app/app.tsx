// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Box, Button, Grid } from '@mui/material';
import AppInput from './components/AppInput';
import { useForm } from 'react-hook-form';
import { useInitial } from './hooks/apiHooks/useInitial';
import { useGetPbfTxData } from './hooks/apiHooks/useGeneratePfbParams';

enum FORM_FIELD {
  NAMESPACE = 'namespace_id',
  MESSAGE = 'message',
  NODE_URL = 'node_url',
  PORT = 'port',
}

interface PfbFormType {
  [FORM_FIELD.NAMESPACE]: '';
  [FORM_FIELD.MESSAGE]: '';
  [FORM_FIELD.NODE_URL]: '';
  [FORM_FIELD.PORT]: '';
}

export function App() {
  const form = useForm({ mode: 'onChange' });
  const {
    data: initialData,
    isLoading: initialLoading,
    error: initialError,
  } = useInitial();
  const {
    data: generatedPfbData,
    isLoading: generatePfbLoading,
    error: generatePfbError,
    mutate: generatePfbTxData,
  } = useGetPbfTxData();

  const { isValid: isFormValid, isDirty: isFormDirty } = formState;

  const formInitValue = useCallback(
    () => ({
      [FORM_FIELD.NAMESPACE]: '',
      [FORM_FIELD.MESSAGE]: '',
      [FORM_FIELD.NODE_URL]: '',
      [FORM_FIELD.PORT]: '',
    }),
    []
  );
  const onReset = useCallback(
    () => reset(formInitValue()),
    [reset, formInitValue]
  );

  const onSubmit = useCallback((data: any) => {
    const formData = data as PfbFormType;
  }, []);

  return (
    <form>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <AppInput
            formName={FORM_FIELD.NAMESPACE}
            form={form}
            label="Namespace Id"
            toolTipText="Random generated namespace Id"
          />
          <AppInput
            formName={FORM_FIELD.MESSAGE}
            form={form}
            label="Message"
            toolTipText="Random generated message"
          />
        </Grid>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          item
          xs={12}
        >
          <AppInput
            formName={FORM_FIELD.NODE_URL}
            form={form}
            label="Node Url"
            toolTipText="Your node public url"
          />
          <AppInput
            formName={FORM_FIELD.PORT}
            form={form}
            label="Port"
            toolTipText="Your node public port"
          />
        </Grid>
        <Grid
          xs
          display="flex"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Box mx={1}>
            <Button
              variant="contained"
              disabled={!isFormValid}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Box>
          <Box mx={1}>
            <Button
              variant="contained"
              disabled={!isFormDirty}
              onClick={onReset}
            >
              Reset
            </Button>
          </Box>
          <Box mx={1}>
            <Button variant="contained">Generate</Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default App;
