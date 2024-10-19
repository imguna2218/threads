import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../../atoms/postsAtom';

function UserPage() {
  const { user, loading } = useGetUserProfile();
  const toast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetching, setFetching] = useState(false);
  const { username } = useParams();
  useEffect(() => {
    const getPosts = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);

        const data = await res.json();
        if (data.error) {
          toast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (err) {
        toast('Error', err, 'error');
        // Show an error message or take appropriate action here.
        setPosts([]);
      } finally {
        setFetching(false);
      }
    }
    getPosts();
  }, [username, toast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }
  if (!user) return <h1>User Not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetching && posts.length === 0 && <h1>User has not posts</h1>}
      {fetching && (
        <Flex align="center" justify={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      }
    </>
  )
}

export default UserPage;
