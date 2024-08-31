import React, { useState } from "react";
import {
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./registerForm";

const postAdminUsers = `/api/users/register`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
    department: "",
    role: "",
  });

  const [formError, setFormError] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newFormError = {};

    if (!formData.fname) newFormError.fname = "First name is required";
    if (!formData.lname) newFormError.lname = "Last name is required";
    if (!formData.email) newFormError.email = "Email is required";
    if (!formData.password) newFormError.password = "Password is required";
    if (formData.password !== formData.rePassword) newFormError.rePassword = "Passwords do not match";
    if (!formData.phone) newFormError.phone = "Phone number is required";
    if (!formData.department) newFormError.department = "Department is required";
    if (!formData.role) newFormError.role = "Role is required";

    setFormError(newFormError);
    return Object.keys(newFormError).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        const response = await fetch(postAdminUsers, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          
          // Store the token and user info in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => navigate("/"), 1500);
        } else {
          console.error("Registration error:", data.message);
          setSnackbar({ open: true, message: data.message || 'Registration failed', severity: 'error' });
        }
      }
    } catch (e) {
      console.error("Frontend error:", e);
      setSnackbar({ open: true, message: 'Registration failed. Please try again.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <RegisterForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        formError={formError}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;