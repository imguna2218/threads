import { Avatar, Box, Flex, Text, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

const Suggested = () => {
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getsuggestedUsers = async () => {
      try {
        const res = await fetch('/api/users/Suggested');
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUsers(data);
      } catch (err) {
        showToast("Error", "Failed to fetch suggested users", "error");
      }
    }

    getsuggestedUsers();

  }, []);
  return (
    <>
      <Flex justifyContent={"center"}>
        <Box border={3} borderColor={"gray.light"} h={"500px"} w={"500px"}>
          <Text align={"center"} m={3}>Here Are some Suggested Users .. Follow them to see their posts ! </Text>
          {users.length > 0 ? (
            users.map((user) => (
              <Flex key={user._id} gap={3} justifyContent={"space-around"} alignItems={"center"} my={10}>
                <Avatar src={user.profilePic} name={user.name} onClick={() => navigate(`/${user.username}`)} />
                <Flex flexDirection={"column"} align={"flex-start"}>
                  <Text>{user.name}</Text>
                  <Text color={"gray.500"}>@{user.username}</Text>
                </Flex>
                <Button>Follow</Button>
              </Flex>
            ))
          ) : (
            <Text align={"center"} mt={5}>No suggested users available</Text>
          )}
          {/* <Flex gap={3} justifyContent={"space-around"} alignItems={"center"} my={10}>
            <Avatar></Avatar>
            <Flex flexDirection={"column"} align={"flex-start"}>
              <Text>FullName</Text>
              <Text color={"gray.dark"}>username</Text>
            </Flex>
            <Button>Follow</Button>
          </Flex> */}
        </Box>
      </Flex>
    </>
  )
}

export default Suggested;
