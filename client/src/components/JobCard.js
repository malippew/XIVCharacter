import React from 'react';
import { Image, Box } from '@chakra-ui/react';

const JobCard = ({ image, job, ...props }) => {

  return (
    <Box {...props}>
      <Image src={image} alt={job} />
    </Box>
  );
};

export default JobCard;