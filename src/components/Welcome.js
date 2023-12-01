import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isValid } from 'date-fns';
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  Fade,
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
  TextField, // Add TextField for search
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PAGE_SIZE = 7;  // number of visitors to display per page

const Welcome = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisplayingMessage, setIsDisplayingMessage] = useState(false);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // state variable for delete
  const [open, setOpen] = useState(false);

  const handleClickOpen = (visitor) => {
    setSelectedVisitor(visitor);
    setOpen(true);
  };
  

  const handleCloseDelete = () => {
    setOpen(false);
  };  

  const handleDeleteConfirmed = () => {
    handleDelete(selectedVisitor._id);
    handleCloseDelete();
  };
  
  
  const handleDelete = async (visitorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/visitor/delete/${visitorId}`);
      console.log("Record deleted successfully");
      searchData(); // Fetch data again after successful deletion
    } catch (error) {
      console.error("Failed to delete visitor:", error.message); // Log the error message
    }
  };
  


  useEffect(() => {
    // Fetch data from API endpoint
    axios
      .get("http://localhost:5000/api/visitor/fetch", {
        params: {
          searchTerm,
        },
      })
      .then((response) => {
        const sortedVisitors = response.data.sort((a, b) =>
          b.checkInTime.localeCompare(a.checkInTime)
        );
        setVisitors(sortedVisitors);
      })
      .catch((error) => {
        console.error("Failed to fetch recently checked-in visitors: ", error);
      });
  }, [currentPage, searchTerm]);
  
  
  
  const searchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/visitor/fetch", {
        params: { searchTerm },
      });
  
      const sortedVisitors = response.data.sort((a, b) =>
        b.checkInTime.localeCompare(a.checkInTime)
      );
      setVisitors(sortedVisitors);
    } catch (error) {
      console.error("Failed to fetch searched visitors:", error);
    }
  };  
  
  
  const openModal = (visitor) => {
    setSelectedVisitor(visitor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVisitor(null);
  };

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

  
  const formatDate = (date) => {
    if (isValid(date)) {
      return format(date, 'yyyy-MM-dd');
    } else {
      return ''; // Return an empty string or some other default value for invalid dates
    }
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
        const unitToken = uuidv4();
        const formDataWithToken = { ...formData, unitToken };
        const res = await axios.post(
          "http://localhost:5000/api/visitor/create",
          formDataWithToken
        );
  
        console.log("Form data submitted successfully:", res.data);
        setSuccessMessage("Form data submitted successfully");
        setErrorMessage(null); // Reset error message
        setIsDisplayingMessage(true); // Display the message
  
        setTimeout(() => {
          // Hide the message after 3 seconds
          setIsDisplayingMessage(false);
        }, 3000);
  
        handleClose();
        setCurrentPage(1); // reset to the first page after submitting
  
        setVisitors([...visitors, res.data]); // Trigger the effect to refresh the visitors data
      } catch (error) {
        setErrorMessage("Error submitting form data");
        setSuccessMessage(null); // Reset success message
        setIsDisplayingMessage(true); // Display the message
  
        setTimeout(() => {
          // Hide the message after 3 seconds
          setIsDisplayingMessage(false);
        }, 3000);
  
        console.error("Error submitting form data:", error);
      }
    }
  };  

  // Calculate the start and end indices for pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  //paginate the visitors
  const paginatedVisitors = visitors.slice(startIndex, endIndex);

  return (
    <Grid container spacing={2} style={{ padding: "1em" }}>
      <Grid item xs={8}>
        <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
          <Alert variant="filled" severity="success" style={{ display: isDisplayingMessage && successMessage ? "block" : "none" }}>
            {successMessage}
          </Alert>
          <Alert variant="filled" severity="error" style={{ display: isDisplayingMessage && errorMessage ? "block" : "none" }}>
            {errorMessage}
          </Alert>

          <Typography variant="h5">Recently Checked-in Visitors</Typography>


          <TextField
            label="Search by Name, Phone, Email, or Date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => searchData(visitors, searchTerm)}
          >
            Search
          </Button>



          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>First Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Last Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Checked In</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Served?</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>More Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedVisitors.map((visitor) => (
                  <TableRow key={visitor._id}>
                    <TableCell>{visitor.firstName}</TableCell>
                    <TableCell>{visitor.lastName}</TableCell>
                    <TableCell>{visitor.email}</TableCell>
                    <TableCell>{visitor.checkInTime}</TableCell>
                    <TableCell>
                      {visitor.served ? (
                        <p style={{ color: "green" }}>YES</p>
                      ) : (
                        <p style={{ color: "red" }}>NO</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => openModal(visitor)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                    <IconButton onClick={() => handleClickOpen(visitor)}>
                      <DeleteIcon />
                    </IconButton>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination controls */}
          <div style={{ marginTop: "1em", display: "flex", justifyContent: "center" }}>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={endIndex >= visitors.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Paper>
      </Grid>

      {/* Delete dialog */}
      <Dialog open={open} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this visitor?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed}>Delete</Button>
        </DialogActions>
      </Dialog>


      
       {/* the backdrop modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
      >
        <Fade in={modalOpen}>
          <Paper style={{padding: "15px", paddingLeft: "40%", backgroundColor: "#dee7ec"}}>
            <h2>Visitor Details</h2>
            {selectedVisitor && (
              <div>
                <p>First Name: {selectedVisitor.firstName}</p>
                <p>Last Name: {selectedVisitor.lastName}</p>
                <p>Phone No: {selectedVisitor.phoneNumber}</p>
                <p>Email: {selectedVisitor.email}</p>
                <p>Department: {selectedVisitor.department}</p>
                <p>Checked In: {selectedVisitor.checkInTime}</p>
                <p>Checked Out: {selectedVisitor.checkOutTime}</p>
                <p>Visitor Code: {selectedVisitor.unitToken}</p>
                <p>Serve status: {selectedVisitor.served ? <span style={{ color: "green" }}>YES</span> : <span style={{ color: "red" }}>NO</span>}</p>
              </div>
            )}
          </Paper>
        </Fade>
      </Modal>


      <Grid item xs={4}>
        <Paper style={{ padding: "16px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
          <div>
            <Button variant="contained" onClick={handleOpen} style={{ marginBottom: "1em" }}>
              New Visitor
            </Button>

            
            {/* Calendar */}
            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
                const formattedDate = formatDate(date); // Format the date here
                setSearchTerm(formattedDate);
                searchData(visitors, formattedDate); // Trigger searchData directly
              }}
              value={selectedDate}
            />


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
