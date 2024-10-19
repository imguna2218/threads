import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react'

const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback((title, description, statis) => {
    toast({
      title: title,
      description: description,
      status: statis,
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  return showToast
}

export default useShowToast;
