import { Box, Flex, Image, useColorMode } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillChrome, AiFillHome } from "react-icons/ai";
import { RxAvatar } from 'react-icons/rx';
import postsAtom from '../../atoms/postsAtom';
import { BsFillChatQuoteFill } from 'react-icons/bs';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [posts, setPosts] = useRecoilState(postsAtom); // Assuming postsAtom contains the posts array.
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={"12"}>
      {currentUser && (
        <Link to='/'>
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt='logo'
        w={6}
        src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
      />
      {currentUser && (
        <>
          <Box cursor={"pointer"}
            onClick={async () => {
              try {
                const response = await fetch(`/api/posts/user/${currentUser.username}`);
                if (!response.ok) {
                  throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
                navigate(`/${currentUser.username}`);
              } catch (err) {
                console.error('Error fetching posts:', err);
              }
            }}>
            <RxAvatar size={24} />
          </Box>
          <Link to={"/chat"} style={{ marginTop: "4px" }}>
            <BsFillChatQuoteFill size={22} />
          </Link>
        </>
      )}
    </Flex>
  )
}

export default Header
