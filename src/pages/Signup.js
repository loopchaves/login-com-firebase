import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseCfg';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { displayLoading, isLoading, getLanguage, setAlert } from '../app/appSlice';

import { Input } from '../components/layout/Input';
import FormBase from '../components/layout/FormBase';
import language from '../lang/lang.json';


export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(isLoading);
  const lang = language[useSelector(getLanguage)];

  const handlerNavigate = () => {
    dispatch(setAlert({ msg: undefined, type: '' }));
    navigate('/');
  }

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(lang.inputError.required),
    email: Yup.string()
      .email(lang.inputError.invalidEmail)
      .required(lang.inputError.required),
    password: Yup.string()
      .min(6, lang.inputError.passwordMin)
      .oneOf([Yup.ref('confirmPassword')], lang.inputError.passwordDontMatch)
      .required(lang.inputError.required),
    confirmPassword: Yup.string()
      .min(6, lang.inputError.passwordMin)
      .oneOf([Yup.ref('password')], lang.inputError.passwordDontMatch)
      .required(lang.inputError.required)
  });

  const buttonAction = {
    action: handlerNavigate,
    label: lang.text.buttonCancel
  }

  async function submit(values) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.name });
      await sendEmailVerification(userCredential.user);
      navigate('/');
    } catch (error) {
      dispatch(displayLoading(false));
      dispatch(setAlert({ msg: error.code, type: 'error' }));
    }
  }

  const checkLoading = useCallback(() => {
    if (loading) dispatch(displayLoading(false));
  }, [loading, dispatch]);

  useEffect(() => checkLoading(), [checkLoading]);

  return (
    <FormBase
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
      buttonSubmit={lang.text.buttonRegister}
      buttonAction={buttonAction}
    >
      <Input type='text' label={lang.text.labelName} name='name' />
      <Input type='text' label={lang.text.labelEmail} name='email' />
      <Input type='password' label={lang.text.labelPassword} name='password' />
      <Input type='password' label={lang.text.labelConfirmPassword} name='confirmPassword' />
    </FormBase>
  );
}
