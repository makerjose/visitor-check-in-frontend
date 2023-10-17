import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";

const Login = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [inputs, setInputs] = useState({email: "", password: "", });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/api/login", {
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // send http request
    sendRequest()
      .then((data) => {
        if (data && data.role) {
          dispatch(authActions.login({ role: data.role }));
          history("/user");
        }
      })
      .catch((error) => {
        console.error("Login failed: ", error);
      });
  };
  


  return (
    <div style={{}}>
      <form onSubmit={handleSubmit}  style={{paddingTop: "50px"}}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          // marginTop="50px"
          width={400}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
          borderRadius="10px"
          backgroundColor= "#ffffff"
          padding= "30px"
        >
          <Typography variant="h2">Login</Typography>

          <TextField
            name="email"
            onChange={handleChange}
            type={"email"}
            value={inputs.email}
            variant="outlined"
            placeholder="Email"
            margin="normal"
          />
          <TextField
            name="password"
            onChange={handleChange}
            type="password"
            value={inputs.password}
            variant="outlined"
            placeholder="Password"
            margin="normal"
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;
