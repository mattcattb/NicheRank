import { Button } from '@mui/material';
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

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
    <div className="flex flex-col items-start mt-3">
      <div className="flex flex-row content-center gap-2 color-yellow">
        <Button onClick={buttonClicked} className="px-6 py-2 w-auto">
          {isFolded ? 'Show' : 'Hide'}
        </Button>
        <Button onClick={reverseButtonClicked} className="px-6 py-2 w-auto">
          {reverse ? 'Reversed' : 'Reverse'}
        </Button>
      </div>
      <List>
        {finalItems.map((item, idx) => (
          <ListItem key={idx}>
            {idx + 1}. {item.name} - {item.score}
          </ListItem>
        ))}
      </List>
    </div>
  );
};
