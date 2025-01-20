import React, { useState, useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { Typography } from '@mui/material';
import MyButton  from '../components/ui/MyButton';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { FiArrowDown, FiArrowUp } from "react-icons/fi"

type GridList = {
  name: string;
  score: number;
}[]

type Props = {
  grid: GridList;
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


  const displayedItems = useMemo(() => {
    let items = isFolded 
      ? props.grid.slice(0, maxItemsFolded)
      : props.grid;

    if (reverse) {
      items = [...items].reverse();
    }

    return items;
  }, [props.grid, isFolded, reverse]);
  
  return (
    <div className="flex flex-col items-start mt-3 px-3">
      <div className="flex flex-row content-center gap-2 color-yellow">
        <MyButton onClick={buttonClicked}>
          {isFolded ? <FaEye/> : <FaEyeSlash/>}
        </MyButton>
        <MyButton onClick={reverseButtonClicked}>
          <Typography className='text-small'>{reverse ? <FiArrowUp/> : <FiArrowDown/>}</Typography>
        </MyButton>
      </div>
      <List>
        {displayedItems.map((item, idx) => {
          const itemPosition = reverse ? props.grid.length - idx : idx + 1;
          return (
            <ListItem key={`${item.name} ${item.score.toFixed(3)}`}>
              {itemPosition}. {item.name} - {item.score.toFixed(0) || 'N/A'}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
