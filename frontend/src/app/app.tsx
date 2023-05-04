// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JsonViewer } from '@textea/json-viewer';
import { ToastContainer, toast } from 'react-toastify';

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
  Typography,
} from '@mui/material';
import AppInput from './components/AppInput';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInitial } from './hooks/apiHooks/useInitial';
import { useGetPbfTxData } from './hooks/apiHooks/useGeneratePfbParams';
import { PbfTxDataResponse, submitPbfTx } from './api/apiService';
import { APiError } from './hooks/apiHooks/base';

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
  const [anyError, setAnyError] = useState<APiError | undefined>(undefined);

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

  const hasResult = useMemo(() => !!pfbTxResult, [pfbTxResult]);
  const disableInputs = useMemo(() => hasResult, [hasResult]);
  const disableGenerateAction = useMemo(() => hasResult, [hasResult]);
  const disableSubmitAction = useMemo(
    () => hasResult || !isFormValid,
    [hasResult, isFormValid]
  );

  const setError = useCallback((error: APiError | undefined) => {
    setAnyError(error);
  }, []);

  const onReset = useCallback(() => {
    setPfbTxResult(undefined);
    generatePfbTxData();
    reset(formInitValue());
  }, [reset, formInitValue, generatePfbTxData]);

  const onSubmit = async (data: any) => {
    const formData = data as PfbFormType;
    setAnyLoading(true);

    try {
      const data = await submitPbfTx(formData);
      setPfbTxResult(data);
    } catch (error) {
      setError(error as APiError);
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
    () => setError(initialError || generatePfbError),
    [initialError, generatePfbError, setError]
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

  useEffect(() => {
    if (anyError) {
      toast.error(anyError?.error);
    }
  }, [anyError]);

  useEffect(() => {
    if (hasResult) {
      toast.success('Successfully created Pfb Tx');
    }
  }, [pfbTxResult, hasResult]);

  return (
    <Box pt={4}>
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
              disabled={disableInputs}
              label="Namespace Id"
              maxL={16}
              minL={16}
              toolTipText="Random generated namespace Id"
            />
            <AppInput
              formName={FORM_FIELD.MESSAGE}
              form={form}
              disabled={disableInputs}
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
              disabled={disableInputs}
              label="Node Url"
              toolTipText="Your node public url"
            />
            <AppInput
              formName={FORM_FIELD.PORT}
              form={form}
              disabled={disableInputs}
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
                disabled={disableSubmitAction}
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
              <Button
                variant="contained"
                onClick={onGenerate}
                disabled={disableGenerateAction}
              >
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
      {hasResult && (
        <Box
          display="flex"
          flexDirection={'column'}
          justifyContent="center"
          alignItems="center"
          mt={5}
        >
          <Typography variant="h5" color="#00A300" fontFamily="sans-serif">
            Pay For Blob Tx Result
          </Typography>
          <JsonViewer
            style={{
              maxHeight: '50vh',
              overflow: 'auto',
              padding: '10px',
              border: '2px solid #C5C5C5',
            }}
            value={pfbTxResult}
          />
        </Box>
      )}
    </Box>
  );
}

export default App;
