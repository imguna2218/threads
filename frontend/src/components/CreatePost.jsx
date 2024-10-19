import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePreviewImage from '../hooks/usePreviewImage'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../../atoms/postsAtom'

const CreatePost = () => {
  const MAX_CHAR = 500;

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [postText, setPostText] = useState("");

  const { handleImageChange, imageURL, setImageURL } = usePreviewImage();
  const imageRef = useRef(null);
  const [remaining, setRemaining] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showTost = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const handleText = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemaining(0);
    } else {
      setPostText(inputText);
      setRemaining(MAX_CHAR - inputText.length);
    }
  }

  const handlePost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imageURL })
      });

      const data = await res.json();
      if (data.error) {
        showTost('Error', data.error, 'error');
        return;
      }
      showTost('Success', 'Post created successfully', 'success');
      onClose();
      setPostText("");
      setImageURL("");
      setPosts([data, ...posts]);
    } catch (error) {
      showTost('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <FormControl>
              <Textarea placeContent="Post Content goes here "
                onChange={handleText}
                value={postText}
              />
              <Text fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remaining}/{MAX_CHAR}
              </Text>
              <Input
                type='file'
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imageURL && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image
                  src={imageURL}
                  alt='Selected Image'
                />
                <CloseButton
                  onClick={() => setImageURL("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handlePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
