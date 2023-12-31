import React, { useState } from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authActions } from "../store";
axios.defaults.withCredentials = true;

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [value, setValue] = useState(0); // Initialize the value to 0 for the first tab

  //Logout request
  const sendLogoutReq = async () => {
    const res = await axios.post("http://localhost:5000/api/user/logout", null, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res;
    }
    return new Error("Unable TO Logout. Please try again");
  };

  //Logout
  const handleLogout = () => {
    sendLogoutReq().then(() => dispatch(authActions.logout()));
  };
  

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <img src="USIU_Africa_Logo.png" alt="logo"
            style={{width: "100px", height: "80px", margin: "10px"}}
          />
          <Typography variant="h3">Visitor Check-In</Typography>
          <Box sx={{ marginLeft: "auto" }}>
          <Tabs
                // indicatorColor="secondary"
                onChange={(e, val) => setValue(val)}
                value={value}
                textColor="inherit"
                >
                {!isLoggedIn ? (
                <>
                    <Tab to="/login" LinkComponent={Link} label="Login" />
                    <Tab to="/signup" LinkComponent={Link} label="Signup" />
                </>
                ) : (
                    <Tab onClick={handleLogout} to="/login" LinkComponent={Link} label="Logout" />
                )}
            </Tabs>

          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
