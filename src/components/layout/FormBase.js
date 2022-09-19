import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { displayLoading, isLoading, setAlert } from '../../app/appSlice';

import styles from './styles/FormBase.module.sass';

export default function FormBase({
  children,
  initialValues,
  validationSchema,
  onSubmit,
  buttonSubmit,
  buttonAction
}) {
  const dispatch = useDispatch();
  const loading = useSelector(isLoading);

  function submit(values, setSubmitting) {
    dispatch(displayLoading(true));
    dispatch(setAlert({ msg: undefined, type: '' }));
    setSubmitting(false);
    onSubmit(values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => submit(values, setSubmitting)}
      validateOnBlur={false}
      validateOnChange={false}
    >
      <Form>
        <div className={styles.container}>
          {children}
          <div className={styles.buttons}>
            <button type='submit' disabled={loading}>{buttonSubmit}</button>
            {buttonAction ? (
              <button onClick={() => buttonAction.action()}>{buttonAction.label}</button>
            ) : null}
          </div>
        </div>
      </Form>
    </Formik>
  );
}
