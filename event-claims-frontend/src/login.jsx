import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  Container,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const postLogin = `/api/users/login`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(postLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      // Store user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign In
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link href="/register" variant="body2">
              Don't have an account? Register
            </Link>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;