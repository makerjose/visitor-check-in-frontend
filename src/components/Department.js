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
    // Fetch data from API endpoint
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
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Checked In</TableCell>
                      <TableCell>Served?</TableCell>
                      {/* Add more table headers as needed */}
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
                          {visitor.served ? "YES" : "NO"}
                        </TableCell>
                        {/* Add more table cells as needed */}
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
