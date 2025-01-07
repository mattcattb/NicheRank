import React from 'react'
import { Button } from '@mui/material'

export default function Link({text, onClick}) {

    
  return (
    <Button
    color="primary"
    variant="contained"
    onClick={onClick}
    style={{
      fontSize: "1.5rem",
      padding: "12px 24px",
      position: "absolute",
      top: "10px",
      left: "10px",
    }}
  >
    {text}
  </Button>
  )
}
