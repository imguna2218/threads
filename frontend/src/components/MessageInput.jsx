import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { IoSendSharp } from "react-icons/io5";
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationsAtom } from '../../atoms/messagesAtom';
import { BsImageFill } from 'react-icons/bs';
import usePreviewImage from '../hooks/usePreviewImage';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const selectedConversation = useRecoilValue(selectedConversationsAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imageURL, setImageURL } = usePreviewImage();
  const [sending, setSending] = useState(false);
  const showToast = useShowToast();


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imageURL) return;
    if (sending) return;

    setSending(true);
    try {
      const res = await fetch('api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imageURL
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast('error', data.error, 'error');
        return;
      }
      setMessages((prevMessages) => [...prevMessages, data]);
      setConversations(prev => {
        const updatedConversations = prev.map(conversation => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            };
          }
          return conversation;
        });
        return updatedConversations;
      })
      setMessageText('');
      setImageURL("");
    } catch (error) {
      showToast('error', error.message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: "95" }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder='type a message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement >
            <IoSendSharp cursor={"pointer"} onClick={handleSendMessage} />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={imageURL}
        onClose={() => {
          onClose();
          setImageURL("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <Flex mt={5} w={"full"}>
            <Image
              src={imageURL}
            />
          </Flex>
          <Flex justifyContent={"flex-end"} my={2}>
            {!sending ? (<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />) : (
              <Spinner size={"md"} />
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default MessageInput
