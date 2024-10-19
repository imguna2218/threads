import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { selectedConversationsAtom } from '../../atoms/messagesAtom'
import userAtom from '../../atoms/userAtom';
import { BsCheck2All } from "react-icons/bs";
import { useState } from 'react';

const Message = ({ message, ownMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationsAtom);
  const user = useRecoilValue(userAtom);
  const profilePic = selectedConversation.userProfilePic;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex
          gap={2}
          alignSelf={"flex-end"}
        >
          {message.text && (
            <Flex bg={"green.800"} alignSelf={"flex-end"} p={1} borderRadius={"md"}>
              <Text color={"white"}>
                {message.text}
              </Text>
              <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message.img && !imageLoaded && (
            <Flex mt={5} w={"280px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt='Message Image'
                borderRadius={4}

              />

              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imageLoaded && (
            <Flex mt={5} w={"280px"}>
              <Image
                src={message.img}
                alt='Message Image'
                borderRadius={4}
              />
              <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          <Avatar src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex
          gap={2}
        >
          <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
          {message.text && (
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
              {message.text}
            </Text>
          )}

          {message.img && !imageLoaded && (
            <Flex mt={5} w={"280px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt='Message Image'
                borderRadius={4}

              />

              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imageLoaded && (
            <Flex mt={5} w={"280px"}>
              <Image
                src={message.img}
                alt='Message Image'
                borderRadius={4}
              />
            </Flex>
          )}

        </Flex>
      )}

    </>
  )
}

export default Message
