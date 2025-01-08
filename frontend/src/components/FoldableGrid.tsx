import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { Button, Typography } from '@mui/material';
import MyButton  from '../components/ui/MyButton';

import { FiArrowDown, FiArrowUp } from "react-icons/fi"

type Props = {
  gridItems: {
    name: string;
    score: number;
  }[];
};

export const FoldableGrid = (props: Props) => {
  const [isFolded, setIsFolded] = useState<boolean>(true);
  const maxItemsFolded = 10; // max items to show when folded

  const [reverse, setReverse] = useState<boolean>(false);

  const buttonClicked = () => {
    setIsFolded(!isFolded);
  };

  const reverseButtonClicked = () => {
    setReverse(!reverse);
  };

  // Get the items to display, optionally reversed
  const displayedItems = isFolded
    ? props.gridItems.slice(0, maxItemsFolded)
    : props.gridItems;

  // If reverse is true, reverse the displayed items
  const finalItems = reverse ? [...displayedItems].reverse() : displayedItems;

  return (
    <div className="flex flex-col items-start mt-3 px-3">
      <div className="flex flex-row content-center gap-2 color-yellow">
        <MyButton onClick={buttonClicked}>
          {isFolded ? 'Show' : 'Hide'}
        </MyButton>
        <Button onClick={reverseButtonClicked} className="h-8 px-6 py-2 w-auto text-sm">
          <Typography className='text-md'>{reverse ? <FiArrowUp/> : <FiArrowDown/>}</Typography>
        </Button>
      </div>
      <List>
        {finalItems.map((item, idx) => {
          const item_position = reverse ? finalItems.length - idx : idx + 1;
          return (
            <ListItem key={idx}>
              {item_position}. {item.name} - {item.score.toFixed(0)}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
