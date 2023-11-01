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
} from "@mui/material";

const Dep = () => {
  const [department, setDepartment] = useState("admission");
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);

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

  // Function to handle tab selection
  const handleTabChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
  };

  // Function to mark a visitor as served
// Function to mark a visitor as served
const handleMarkServed = (visitorId) => {
  axios
    .put(`http://localhost:5000/api/visitor/update/${visitorId}`, {})
    .then((response) => {
      if (response.status === 200) {
        console.log("Visitor marked as served successfully");

        // After marking as served, update the visitors list to reflect the change
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
                            <p style={{ color: "green" }}>Served</p>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() => handleMarkServed(visitor._id)}
                            >
                              Mark Served
                            </Button>
                          )}
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
    </div>
  );
};

export default Dep;
