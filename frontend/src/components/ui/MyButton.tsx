import { Button } from '@mui/material'

type Props = {
  onClick: () => void;
  children: React.ReactNode;
}

export default function MyButton( props:Props) {
  return (
    <Button
    color="primary"
    className='px-4 py-2'
    onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}
