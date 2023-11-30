
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Dep = () => {
  const [department, setDepartment] = useState("admission");
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get("http://localhost:5000/api/visitor/fetch")
      .then((response) => {
        const sortedVisitors = response.data.sort((a, b) =>
          b.checkInTime.localeCompare(a.checkInTime)
        );
        setVisitors(sortedVisitors);
      })
      .catch((error) => {
        console.error("Failed to fetch recently checked-in visitors: ", error);
      });
  }, []);

  useEffect(() => {
    // Filter the visitors when the 'department' state changes
    const filtered = visitors.filter((visitor) => visitor.department === department);
    setFilteredVisitors(filtered);
  }, [department, visitors]);

  const handleTabChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
  };

  const handleMarkServed = (visitorId) => {
    axios
      .put(`http://localhost:5000/api/visitor/update/${visitorId}`, {})
      .then((response) => {
        if (response.status === 200) {
          console.log("Visitor marked as served successfully");
          axios
            .get("http://localhost:5000/api/visitor/fetch")
            .then((response) => {
              const sortedVisitors = response.data.sort((a, b) =>
                b.checkInTime.localeCompare(a.checkInTime)
              );
              setVisitors(sortedVisitors);
            })
            .catch((error) => {
              console.error("Failed to fetch recently checked-in visitors: ", error);
            });
        } else {
          console.error("Failed to mark the visitor as served.");
        }
      })
      .catch((error) => {
        console.error("Failed to mark the visitor as served: ", error);
      });
  };

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
       <Grid container spacing={2}>
         <Grid item xs={12}>
           <Card>
             <CardContent>
              <Typography variant="h5">Department Filter</Typography>
              <CardActions>
                 <Button
                  variant={department === "admission" ? "contained" : "outlined"}
                  onClick={() => handleTabChange("admission")}
                >
                  Admission
                </Button>
                <Button
                  variant={department === "catering" ? "contained" : "outlined"}
                  onClick={() => handleTabChange("catering")}
                >
                  Catering
                </Button>
                <Button
                  variant={department === "registrar" ? "contained" : "outlined"}
                  onClick={() => handleTabChange("registrar")}
                >
                  Registrar
                </Button>
                <Button
                  variant={department === "sports" ? "contained" : "outlined"}
                  onClick={() => handleTabChange("sports")}
                >
                  Sports
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Filtered Visitors</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ fontWeight: "bold" }}>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Checked In</TableCell>
                      <TableCell>Served?</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVisitors.map((visitor) => (
                      <TableRow key={visitor._id}>
                        <TableCell>{visitor.firstName}</TableCell>
                        <TableCell>{visitor.lastName}</TableCell>
                        <TableCell>{visitor.email}</TableCell>
                        <TableCell>{visitor.checkInTime}</TableCell>
                        <TableCell>
                          {visitor.served ? (
                            <p><span style={{ color: "green" }}>Served </span> [ <span>{visitor.checkInTime} ]</span> </p>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() => handleMarkServed(visitor._id)}
                            >
                              Mark Served
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" onClick={() => handleViewDetails(visitor)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for displaying visitor details */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Visitor Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Display additional details about the visitor */}
            {selectedVisitor && (
              <>
                <p>First Name: {selectedVisitor.firstName}</p>
                <p>Last Name: {selectedVisitor.lastName}</p>
                <p>Phone No: {selectedVisitor.phoneNumber}</p>
                <p>Email: {selectedVisitor.email}</p>
                <p>Department: {selectedVisitor.department}</p>
                <p>Checked In: {selectedVisitor.checkInTime}</p>
                <p>Checked Out: {selectedVisitor.checkOutTime}</p>
                <p>Visitor Code: {selectedVisitor.unitToken}</p>
                <p>Serve status: {selectedVisitor.served ? <span style={{ color: "green" }}>YES</span> : <span style={{ color: "red" }}>NO</span>}</p>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dep;

