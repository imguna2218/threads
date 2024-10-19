import { Avatar, Box, Button, Center, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom'
import { Navigate, Link as RouterLink } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import useFollowUnfollow from '../hooks/useFollowUnfollow';


function UserHeader({ user }) {
  const toast = useToast();
  const currrentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  // const [following, setFollowing] = useState(user.followers.includes(currrentUser?._id));

  // const showToast = useShowToast();
  // const [updating, setUpdating] = useState(false);

  // const handleFollow = async () => {
  //   if (!currrentUser) {
  //     showToast("Error", "You need to be logged in to follow users", "error");
  //     return;
  //   }
  //   if (updating) {
  //     return;
  //   }
  //   setUpdating(true);
  //   try {
  //     const res = await fetch(`/api/users/follow/${user._id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();
  //     if (data.error) {
  //       showToast("Error", data.error, "error");
  //       return;
  //     }
  //     if (following) {
  //       showToast("Success", `Unfollowing ${user.username}`, "success");
  //       user.followers.pop();
  //     } else {
  //       showToast("Success", `Following ${user.username}`, "success");
  //       user.followers.push(currrentUser?._id);
  //     }
  //     setFollowing(!following);
  //     console.log(data);
  //   } catch (error) {
  //     showToast("Error", error, "error");
  //   } finally {
  //     setUpdating(false);
  //   }
  // }

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: 'URL copied to clipboard',
        description: currentURL,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    });
  }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl"
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src='https://bit.ly/broken-link'
              size={{
                base: "md",
                md: "xl"
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio} </Text>
      {currrentUser?._id === user._id && (
        <RouterLink to='/update'>
          <Button size={"sm"}>Update Profile</Button>
        </RouterLink>
      )}
      {currrentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex gap={2} justifyContent={"space-evenly"}>
          <BsInstagram size={20} cursor={"pointer"} />
          <Menu>
            <MenuButton>
              <CgMoreO size={20} cursor={"pointer"} />
            </MenuButton>
            <Portal>
              <MenuList bg={"gray.dark"}>
                <MenuItem onClick={copyURL}>Copy Link</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px gray white"} justifyContent={"center"} color={"gray.light"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader
