import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImage = () => {
  const [imageURL, setImageURL] = useState(null);
  const toast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setImageURL(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast("Invalid File type", "Please select a image file ", "error");
      setImageURL(null);
    }
  };

  return { handleImageChange, imageURL, setImageURL };
}

export default usePreviewImage;
