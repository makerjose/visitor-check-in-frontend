import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  FormHelperText,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Close } from "@mui/icons-material";
// import { Grid, Paper, Typography, Select, MenuItem } from "@mui/material";
import { v4 as uuidv4 } from 'uuid'; 

const Welcome = () => {
  const [visitors, setVisitors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNo: "",
    email: "",
    phoneNumber: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch data from API endpoint 
    axios.get("http://localhost:5000/api/visitor/fetch")
      .then((response) => {
        setVisitors(response.data); // Assuming the API response is an array of visitor objects
      })
      .catch((error) => {
        console.error("Failed to fetch recently checked-in visitors: ", error);
      });
  }, []); 

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      idNo: "",
      email: "",
      phoneNumber: "",
      department: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Form validation
    const newErrors = {};
  
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.idNo) {
      newErrors.idNo = "ID/Passport No is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Check if the email matches a basic email format
      newErrors.email = "Invalid email format";
    }
  
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Generate a unique token
        const unitToken = uuidv4();
  
        // Add the unitToken to the formData
        const formDataWithToken = { ...formData, unitToken };
  
        // Make an API POST request to save the data
        const res = await axios.post("http://localhost:5000/api/visitor/create", formDataWithToken);
        console.log("Form data submitted successfully:", res.data);
        handleClose();
      } catch (error) {
        console.error("Error submitting form data:", error);
      }
    }
  };
  
  

  return (
    <Grid container spacing={2} style={{ padding: "1em" }}>

      <Grid item xs={8}>
        <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
          <Typography variant="h5">Recently Checked-in Visitors</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Checked In</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor._id}>
                    <TableCell>{visitor.firstName}</TableCell>
                    <TableCell>{visitor.lastName}</TableCell>
                    <TableCell>{visitor.email}</TableCell>
                    <TableCell>{visitor.checkInTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={4}>
        <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
          <div>
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
                <div style={{ backgroundColor: "rgba(255, 255, 255, 255)", padding: "16px", width: 400, borderRadius: "10px" }}>
                  <FormControl fullWidth error={!!errors.firstName} style={{ margin: "10px" }}>
                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <FormHelperText>{errors.firstName}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth error={!!errors.lastName} style={{ margin: "10px" }}>
                    <InputLabel htmlFor="lastName">Last Name</InputLabel>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <FormHelperText>{errors.lastName}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth error={!!errors.idNo} style={{ margin: "10px" }}>
                    <InputLabel htmlFor="idNo">ID/Passport No</InputLabel>
                    <Input
                      id="idNo"
                      name="idNo"
                      value={formData.idNo}
                      onChange={handleChange}
                    />
                    {errors.idNo && (
                      <FormHelperText>{errors.idNo}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth error={!!errors.email} style={{ margin: "10px" }}>
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
                  <FormControl fullWidth error={!!errors.phoneNumber} style={{ margin: "10px" }}>
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
                  <FormControl fullWidth error={!!errors.department} style={{ margin: "10px" }}>
                    <InputLabel htmlFor="department">Department</InputLabel>
                    <Select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <MenuItem value="admission">Admission</MenuItem>
                      <MenuItem value="catering">Catering</MenuItem>
                      <MenuItem value="registrar">Registrar</MenuItem>
                      <MenuItem value="sports">Sports</MenuItem>
                    </Select>
                    {errors.department && (
                      <FormHelperText>{errors.department}</FormHelperText>
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
    </Grid>
  );
};

export default Welcome;
