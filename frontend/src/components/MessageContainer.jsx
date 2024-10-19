import { Flex, useColorModeValue, Avatar, Text, Image, Divider, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import messageSound from '../assets/sounds/message.mp3';
import Message from './Message';
import MessageInput from './MessageInput';
import { useEffect, useRef, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { conversationsAtom, selectedConversationsAtom } from '../../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { useSocket } from '../context/SocketContext';


const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationsAtom);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }
      setConversations((prev) => {
        const updatedConvo = prev.map(c => {
          if (c._id === message.conversationId) {
            return {
              ...c,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              }
            }
          }
          return c;
        });
        return updatedConvo;
      })
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit('markMessagesAsSeen', {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId
      })
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages(prev => {
          const updatedMessages = prev.map(message => {
            if (!message.seen) {
              return { ...message, seen: true }
            }
            return message;
          })
          return updatedMessages;
        })
      }
    })

  }, [socket, currentUser._id, messages, selectedConversation]);


  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation?.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setMessages(data);
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    }

    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);
  return (
    <Flex flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text
          fontWeight={"bold"}
          display={"flex"}
          alignItems={"center"}
        >
          {selectedConversation.username} <Image src='verified.png' w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      {/* Messages */}
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',

          }
        }}
      >
        {/* Dynamically Render Messages */}
        {loading && ([...Array(5)].map((_, i) => (
          <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
            {i % 2 === 0 && <SkeletonCircle size={7} ></SkeletonCircle>}
            <Flex flexDir={"column"} gap={2}>
              <Skeleton h={"8px"} w={"250px"} />
              <Skeleton h={"8px"} w={"250px"} />
              <Skeleton h={"8px"} w={"250px"} />
            </Flex>
            {i % 2 !== 0 && <SkeletonCircle size={7} />}

          </Flex>
        )))}
        {!loading && (
          messages.map(m => (
            <Flex key={m._id} direction={"column"}
              ref={messages.length - 1 === messages.indexOf(m) ? messageEndRef : null}
            >
              <Message message={m} ownMessage={currentUser._id === m.sender} />
            </Flex>
          ))
        )}

        {/* <Message ownMessage={true} /> */}

        {/* {messages.map(m) => } */}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
}

export default MessageContainer;
