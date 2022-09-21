import { auth } from "./firebaseCfg";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  sendPasswordResetEmail
} from "firebase/auth";

const userPattern = (currentUser) => {
  return {
    uid: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    creationDate: new Date(parseInt(currentUser.metadata.createdAt)).toLocaleString(),
    lastLogin: new Date(parseInt(currentUser.metadata.lastLoginAt)).toLocaleString()
  }
}

export const handlerVerifyUser = async () => {
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (currentUser) => {
      currentUser ? resolve(userPattern(currentUser)) : resolve(null);
    });
  });
  return user;
}

export const handlerVerifyPasswordCode = async (actionCode) => {
  const email = await verifyPasswordResetCode(auth, actionCode);
  return email;
}

export const handlerVerifyEmailCode = async (actionCode) => {
  await applyActionCode(auth, actionCode);
  await auth.currentUser?.reload();
}

export const handlerTryLogin = async (values) => {
  const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
  return userPattern(userCredential.user);
}

export const handlerTryLogout = async () => {
  await signOut(auth);
  return null;
}

export const handlerTrySignup = async (values) => {
  const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
  await updateProfile(userCredential.user, { displayName: values.name });
  await sendEmailVerification(userCredential.user);
  return userPattern(userCredential.user);
}

export const handlerTryPasswordReset = async (values) => {
  await confirmPasswordReset(auth, values.actionCode, values.newPassword);
  const userCredential = await signInWithEmailAndPassword(auth, values.email, values.newPassword);
  return userPattern(userCredential.user);
}

export const handlerTrySendPasswordResetEmail = async (values) => {
  await sendPasswordResetEmail(auth, values.email);
}