import React, { useState } from "react";
import { Button, Modal, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material"; 

const Welcome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    checkInTime: "",
  });
  const [errors, setErrors] = useState({});

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      checkInTime: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation here
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.checkInTime) {
      newErrors.checkInTime = "Check-in time is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Handle form submission (e.g., send data to the server)
      console.log("Form data submitted:", formData);
      handleClose();
    }
  };

  return (



  <Grid container spacing={2}  style={{padding: "1em"}}>
  {/* First Column */}
  <Grid item xs={6}>
    <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
    <div >
      <Button variant="contained" onClick={handleOpen}>
        New Visitor
      </Button>
      <Modal 
          open={isOpen}
          onClose={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: "rgba(255, 255, 255, 255)", padding: "16px", width: 300, borderRadius: "10px" }}>
            <FormControl fullWidth error={!!errors.name}>
              <InputLabel htmlFor="name">First Name</InputLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.name}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.name}>
              <InputLabel htmlFor="name">Last Name</InputLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <FormHelperText>{errors.name}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.email}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <FormHelperText>{errors.email}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.phoneNumber}>
              <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <FormHelperText>{errors.phoneNumber}</FormHelperText>
              )}
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </div>
        </form>
      </Modal>
    </div>
    </Paper>
  </Grid>
  
  {/* second column */}
  <Grid item xs={6}>
    <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
    <Typography variant="h5">Checked-in Visitors</Typography>
    </Paper>
  </Grid>
  </Grid>
  );
};

export default Welcome;
