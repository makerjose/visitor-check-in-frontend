import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      const data = res.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitting(true);
      sendRequest()
        .then(() => history("/login"))
        .catch((error) => {
          console.error("Signup failed: ", error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ paddingTop: "50px" }}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          width={400}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          borderRadius="10px"
          backgroundColor="#ffffff"
          padding="30px"
        >
          <Typography variant="h2">Signup</Typography>

          <TextField
            name="name"
            onChange={handleChange}
            value={inputs.name}
            variant="outlined"
            placeholder="Name"
            margin="normal"
            error={errors.name}
            helperText={errors.name}
          />
          <TextField
            name="email"
            onChange={handleChange}
            type="email"
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin="normal"
            error={errors.email}
            helperText={errors.email}
          />
          <TextField
            name="password"
            onChange={handleChange}
            type="password"
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin="normal"
            error={errors.password}
            helperText={errors.password}
          />
          <Button variant="contained" type="submit" disabled={submitting}>
            {submitting ? "Signing up..." : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
