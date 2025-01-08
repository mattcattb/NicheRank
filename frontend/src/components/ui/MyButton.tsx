import { Button } from '@mui/material'

type Props = {
  onClick: () => void;
  children: React.ReactNode;
}

export default function MyButton( props:Props) {
  return (
    <Button
    className=''
    color="primary"
    variant="contained"
    onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}
