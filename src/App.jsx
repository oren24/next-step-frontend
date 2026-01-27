import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nextstep Project
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>

        <Typography variant="h4" gutterBottom>
          Vite + React + MUI
        </Typography>

        <Button variant="contained" color="primary" onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </Button>

        <Typography sx={{ mt: 2 }}>
          Edit <code>src/App.jsx</code> and save to test HMR
        </Typography>

        <Typography className="read-the-docs" sx={{ mt: 3 }}>
          Click on the Vite and React logos to learn more
        </Typography>
      </Container>
    </>
  )
}

export default App
