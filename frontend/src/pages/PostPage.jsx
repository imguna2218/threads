import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../../atoms/postsAtom";

function PostPage() {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currrentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts((prevPosts) => [data, ...prevPosts]);
        setPost(data);
      } catch (err) {
        showToast("Error", err.message, "error");
      }
    }

    getPost();

  }, [showToast, pid, setPosts]);


  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete")) {
        return;
      }
      const response = await fetch(`/api/posts/${currentPost._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted successfully", "success");
      navigate(`/${user.username}`);

    } catch (err) {
      showToast('Error', 'Failed to delete post', 'error');
    }
  }



  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }
  if (!currentPost) {
    return null;
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user.profilePic} size={"md"} name={user.name}
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" w="4" h={4} ml={2} mt={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true, includeSeconds: false }).replace("about ", "")}
          </Text>
          {currrentUser?._id === user?._id && <DeleteIcon size={20} onClick={handleDeletePost} cursor={"pointer"} />}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text} </Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image
            src={currentPost.img}
            w={'full'}
          />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4}></Divider>
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {
        currentPost.replies.map(reply => (
          <Comment
            key={reply._id}
            reply={reply}
          />
        ))
      }
      {/* <Comment
        comment="This looks great !!"
        createdAt='2d'
        likes={100}
        username='gunasekhar'
        userAvatar='https://bit.ly/dan-abramov'
      /> */}
    </>
  )
}

export default PostPage;
