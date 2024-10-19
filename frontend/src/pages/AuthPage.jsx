import React from 'react'
import SignUp from '../components/SignUp'
import Login from '../components/Login'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../../atoms/authAtoms'

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);

  return (
    <>
      {authScreenState === 'login' ? <Login /> : <SignUp />}
    </>
  )
}

export default AuthPage
