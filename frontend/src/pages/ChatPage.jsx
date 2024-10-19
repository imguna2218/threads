import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import { GiConversation } from "react-icons/gi";
import MessageContainer from '../components/MessageContainer';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationsAtom } from '../../atoms/messagesAtom';
import userAtom from '../../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const ChatPage = () => {
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationsAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations(prev => {
        const updatedConverstions = prev.map(conversation => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true
              }
            }
          }
          return conversation;
        })
        return updatedConverstions;
      })
    })
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch('/api/messages/conversations');
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    getConversations();
  }, [showToast, setConversations]);

  const handleConvoSearch = async (e) => {
    e.preventDefault();
    setSearchUser(true);
    try {
      const res = await fetch(`/api/users/profile/${search}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const messaginYourself = searchedUser._id === currentUser._id;
      if (messaginYourself) {
        showToast("Error", "You can't start a conversation with yourself", "error");
        return;
      }

      const convoAlreadyExists = conversations.find(c => c.participants[0]._id === searchedUser._id);
      if (convoAlreadyExists) {
        setSelectedConversation({
          _id: convoAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
          participants: conversations.find(c => c.participants[0]._id === searchedUser._id).participants
        });
        return;
      }

      const mockConvo = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic
          }

        ]
      }
      setConversations(prev => [...prev, mockConvo]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchUser(false);
    }
  }
  return (
    <Box position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px"
      }}
      p={4}

      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row"
        }}
        maxW={{
          sm: "400px",
          md: 'full'
        }}
        mx={"auto"}
      >
        <Flex flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: 'full'
          }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>Your Conversations</Text>
          <form onSubmit={handleConvoSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder='search for a user' onChange={(e) => setSearch(e.target.value)} value={search} />
              <Button size={"md"} onClick={handleConvoSearch} isLoading={searchUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loading && (
            [0, 1, 2, 3, 4].map((i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex
                  w={"full"}
                  flexDirection={"column"}
                  gap={3}
                >
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))
          )}
          {!loading && (
            conversations.map(conversation => (
              <Conversation key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation} />
            ))
          )}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            h={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Slect a conveo to start messsaging </Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  )
}

export default ChatPage
