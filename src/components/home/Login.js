import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../../firebaseCfg';
import { signInWithEmailAndPassword } from "firebase/auth";

import { Input } from '../layout/Input';
import FormBase from '../layout/FormBase';
import ForgotPassword from '../home/ForgotPassword';
import styles from './styles/Login.module.sass';
import language from '../../lang/lang.json';


auth.useDeviceLanguage();
const lang = language[auth.languageCode.substring(0, 2)];


export default function Login({ handlerUser }) {
  const navigate = useNavigate();
  const handlerNavigate = () => navigate('/signup');

  const [forgotPassword, setForgotPassword] = useState(false);
  const handlerForgotPassword = () => setForgotPassword(!forgotPassword);

  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(lang.inputError.required),
    password: Yup.string()
      .required(lang.inputError.required)
  })

  const buttonAction = {
    action: handlerNavigate,
    label: lang.text.buttonSignup
  }

  async function submit(values, setLoading, setSubmitting, setErrorType) {
    setLoading(true);
    setSubmitting(false);
    setErrorType(undefined);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      handlerUser(true);
    } catch (error) {
      setLoading(false);
      setErrorType(error.code);
    }
  }

  return (
    <>
      {forgotPassword
        ? <ForgotPassword handlerForgotPassword={handlerForgotPassword} />
        : (
          <FormBase
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
            buttonSubmit={lang.text.buttonLogin}
            buttonAction={buttonAction}
          >
            <Input type='text' label={lang.text.labelEmail} name='email' />
            <Input type='password' label={lang.text.labelPassword} name='password' />
            <button onClick={() => handlerForgotPassword()} className={styles.forgotPasswordLink}>
              {lang.text.buttonForgotPassword}
            </button>
          </FormBase>
        )}
    </>
  );
}
