import React from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  MenuItem,
  Container,
} from "@mui/material";

const departments = ["HR", "Account", "IT", "Marketing"];
const roles = ["User", "Admin"];

const RegisterForm = ({ formData, onChange, onSubmit, formError }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {["fname", "lname", "email", "password", "rePassword", "phone"].map(
          (field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace("rePassword", "Re-enter Password")
                }
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                error={!!formError[field]}
                helperText={formError[field] || ""}
              />
            </Grid>
          )
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </Grid>
        <Grid item xs={12}>
          {formError.global && (
            <Typography color="error">
              {formError.global}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterForm;
