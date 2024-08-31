import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { TaskAlt } from '@mui/icons-material'; // Example icon from MUI icons

const Header = ({ userFname, userRole, onCreateTask, onLogout }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <AppBar position="static" sx={{ backgroundColor: '#A7BEAE', boxShadow: 3 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="tasknex-icon" sx={{ mr: 1 }}>
            <TaskAlt />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: 'Libre Baskerville, serif',
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            TaskNex
          </Typography>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: 'Playwrite IS, serif',
              color: '#fff',
              fontWeight: 'bold',
              ml: 2
            }}
          >
            Welcome back, {userFname}
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={onCreateTask}
              sx={{
                backgroundColor: '#E7E8D1',
                color: '#fff',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#e68900',
                },
              }}
            >
              Make a new task
            </Button>
            <Button
              variant="contained"
              onClick={onLogout}
              sx={{
                backgroundColor: '#f44336',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              Log out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
