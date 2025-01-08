import { Button } from '@mui/material';
import React, {useState} from 'react'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';


type Props = {
  gridItems: [{
    name:string,
    score:number
  }]
}

export const FoldableGrid = (props: Props) => {
  // todo add button to reverse elements if selected
  const [isFolded, setIsFolded] = useState<boolean>(true);
  const maxItemsFolded = 10; // max items to show when folded 

  const buttonClicked = () => {
    setIsFolded(!isFolded);
  }

  const displayedItems = isFolded 
  ? props.gridItems.slice(0, maxItemsFolded) 
  : props.gridItems;
  console.log(props.gridItems)

  return (
    <div className='flex flex-col items-stretch'>
      <List>
        {displayedItems.map((item, idx) => (<ListItem key={idx}>{idx}. {item.name} - {item.score}</ListItem>))}      
      </List>
      <Button onClick={buttonClicked}>{isFolded? "show": "hide"}</Button>
    </div>
  )
}