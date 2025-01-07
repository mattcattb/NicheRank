import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface ScoreElementProps {
  content: string | number; // Assuming content can be either a string or a number
  index: number;
  sx?: SxProps<Theme>; // Optional 'sx' prop for styling
}

export default function ScoreElement({ content, index, sx = {} }: ScoreElementProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(223,214,239,0.3)',
        p: 2,
        textAlign: 'left',
        typography: 'bodyBold',
        color: 'white',
        borderRadius: 1,
        boxShadow: 2,
        whiteSpace: 'nowrap',
        ...sx, // Allow overriding or extending styles
      }}
    >
      {index + 1} / {content}
    </Box>
  );
}
