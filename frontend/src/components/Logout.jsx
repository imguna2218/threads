import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json();
      //console.log(data);

      if (data.error) {
        showToast("Error", data.error, "error");
      }

      localStorage.removeItem('user-threads');
      setUser(null);
      navigate('/');
    } catch (err) {
      showToast("Error", err, "error");
      // Show an error message or take appropriate action here.
    }
  }
  return (
    <>
      <Button
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
        onClick={handleLogOut}
      >
        <HiOutlineLogout size={20} />
      </Button>
    </>
  )
}

export default Logout
