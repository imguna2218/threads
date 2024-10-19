import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

const Comment = ({ reply }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <Flex gap={4} p={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{reply.username}</Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text>{reply.text} </Text>
          {/* <Actions liked={liked} setLiked={setLiked}></Actions>
          <Text fontSize={"sm"} color={"gray.light"}>
            {likes + (liked ? 1 : 0)} likes
          </Text> */}
        </Flex>
      </Flex>
      <Divider />
    </div>
  )
}

export default Comment
