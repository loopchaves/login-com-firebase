import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { tryLogin, setLoading, getLanguage, setAlert } from '../../app/appSlice';

import { Email, Password } from '../layout/Input';
import FormBase from '../layout/FormBase';
import ForgotPassword from '../home/ForgotPassword';
import styles from './styles/Login.module.sass';
import language from '../../lang/lang.json';


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = language[useSelector(getLanguage)];
  const [forgotPassword, setForgotPassword] = useState(false);

  const handlerNavigate = () => navigate('/signup');

  const handlerForgotPassword = () => {
    dispatch(setAlert(undefined));
    setForgotPassword(!forgotPassword);
  }

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

  function submit(values) {
    dispatch(tryLogin(values));
  }

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

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
            <Email label={lang.text.labelEmail} name='email' autoComplete='username' />
            <Password label={lang.text.labelPassword} name='password' autoComplete='current-password' />
            <p onClick={() => handlerForgotPassword()} className={styles.forgotPasswordLink}>
              {lang.text.buttonForgotPassword}
            </p>
          </FormBase>
        )}
    </>
  );
}
