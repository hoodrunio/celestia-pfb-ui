// eslint-disable-next-line @typescript-eslint/no-unused-vars

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import AppInput from './components/AppInput';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { useInitial } from './hooks/apiHooks/useInitial';
import { useGetPbfTxData } from './hooks/apiHooks/useGeneratePfbParams';
import { PbfTxDataResponse, submitPbfTx } from './api/apiService';

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
  const [anyLoading, setAnyLoading] = useState(false);
  const [anyError, setAnyError] = useState<string | undefined>(undefined);

  const [pfbTxResult, setPfbTxResult] = useState<PbfTxDataResponse | undefined>(
    undefined
  );
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

  const { handleSubmit, reset, formState, setValue } = form;
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

  const onSubmit = async (data: any) => {
    const formData = data as PfbFormType;
    setAnyLoading(true);

    try {
      const data = await submitPbfTx(formData);
      setPfbTxResult(data);
      console.log(data);
    } catch (error) {
      const er = error as string;
      setAnyError(er ?? 'Something went wrong');
    } finally {
      setAnyLoading(false);
    }
  };

  const onGenerate = useCallback(() => {
    generatePfbTxData();
  }, [generatePfbTxData]);

  useEffect(
    () => setAnyLoading(initialLoading || generatePfbLoading),
    [initialLoading, generatePfbLoading]
  );

  useEffect(
    () => setAnyError(initialError ?? generatePfbError),
    [initialError, generatePfbError]
  );

  useEffect(() => {
    if (initialData?.pfb_tx_data || generatedPfbData) {
      const namespaceId =
        generatedPfbData?.namespace_id || initialData.pfb_tx_data.namespace_id;
      const message =
        generatedPfbData?.message || initialData.pfb_tx_data.message;

      setValue(FORM_FIELD.NAMESPACE, namespaceId);
      setValue(FORM_FIELD.MESSAGE, message);
    }
  }, [initialData, setValue, generatedPfbData]);

  return (
    <Container>
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
              maxL={16}
              minL={16}
              toolTipText="Random generated namespace Id"
            />
            <AppInput
              formName={FORM_FIELD.MESSAGE}
              form={form}
              maxL={200}
              minL={200}
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
              <Button variant="contained" onClick={onGenerate}>
                Generate
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={anyLoading}
      >
        <CircularProgress color="info" />
      </Backdrop>
      {anyError && <div>Error: {JSON.stringify(anyError)}</div>}
      {pfbTxResult && <div>Success: {JSON.stringify(pfbTxResult)}</div>}
    </Container>
  );
}

export default App;
