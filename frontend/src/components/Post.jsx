import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../hooks/useShowToast';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import postsAtom from '../../atoms/postsAtom';

function Post({ post, postedBy }) {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currrentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/users/profile/" + postedBy);
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("error", error.message, "error");
        setUser(null);
      }
    }
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete")) {
        return;
      }
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted successfully", "success");
      setPosts(posts.filter((p) => p._id !== post._id));

    } catch (err) {
      showToast('Error', 'Failed to delete post', 'error');
    }
  }

  const settingPosts = async () => {
    try {
      const res = await fetch(`/api/posts/user/${user.username}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPosts(data);
      console.log(data);
    } catch (error) {
      showToast("error", error.message, "error");
    }
  }

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} marginBottom={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              settingPosts();
              navigate(`/${user.username}`);
            }}

          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {
              post.replies[0] && (
                <Avatar
                  size={"xs"}
                  name='Guna'
                  src={post.replies[0].userProfilePic}
                  position={"absolute"}
                  top="0px"
                  left="15px"
                  p="2px"
                />
              )
            }
            {
              post.replies[1] && (
                <Avatar
                  size="xs"
                  name='Guna'
                  src={post.replies[1].userProfilePic}
                  position={"absolute"}
                  bottom="0px"
                  right="-5px"
                  p="2px"
                />
              )
            }
            {
              post.replies[2] && (
                <Avatar
                  size="xs"
                  name='Guna'
                  src={post.replies[2].userProfilePic}
                  position={"absolute"}
                  bottom="0px"
                  left="4px"
                  p="2px"
                />
              )
            }

          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  settingPosts();
                  navigate(`/${user?.username}`);
                }}
              >{user?.username}</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, includeSeconds: false }).replace("about ", "")}
              </Text>
              {currrentUser?._id === user?._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
            </Flex>
          </Flex>
          <Text fontWeight={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image
                src={post.img}
                alt='Dan Abramov'
                w={'full'}
              />
            </Box>
          )}
          <Flex gap={3} my={1} onClick={(e) => e.preventDefault()}>
            <Actions post={post} ></Actions>
          </Flex>
        </Flex>
      </Flex>
    </Link >
  )
}

export default Post;

