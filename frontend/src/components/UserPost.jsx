import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

function UserPost({ postImg, postTitle, likes, replies }) {
  const [liked, setLiked] = useState(false);


  return (
    <Link to={"/markzuckerburg/post/1"}>
      <Flex gap={3} marginBottom={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name='Mark Zucker burg' src='/zuck-avatar.png' />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size={"xs"}
              name='Guna'
              src='https://bit.ly/dan-abramov'
              position={"absolute"}
              top="0px"
              left="15px"
              p="2px"
            />
            <Avatar
              size="xs"
              name='Guna'
              src='https://bit.ly/ryan-florence'
              position={"absolute"}
              bottom="0px"
              right="-5px"
              p="2px"
            />
            <Avatar
              size="xs"
              name='Guna'
              src='https://bit.ly/prosper-baba'
              position={"absolute"}
              bottom="0px"
              left="4px"
              p="2px"
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerburg</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontWeight={"sm"}>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >

              <Image
                src={postImg}
                alt='Dan Abramov'
                w={'full'}
              />
            </Box>
          )}

          <Flex>
            <Actions liked={liked} setLiked={setLiked}></Actions>
          </Flex>
          <Flex gap={3} my={1}>
            <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}

export default UserPost
