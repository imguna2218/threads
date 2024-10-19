import { Box, Flex, Spinner } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import Suggested from '../components/Suggested'
import SuggestedUsers from '../components/SuggestedUsers'

function HomePage() {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      // setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (err) {
        showToast('Error', err.message, 'error');
        return;
      } finally {
        setLoading(false);
      }
    }
    getFeedPosts();
  }, []);


  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && <Suggested />}
        {loading && (
          <Flex align="center" justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box flex={30}
        display={{
          base: "none",
          md: "block"
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
