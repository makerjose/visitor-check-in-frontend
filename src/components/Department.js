import React from "react";
import { Card, CardContent, CardActions, Button, Typography, Grid } from "@mui/material";

const Dep = () => {
  return (
    <Grid container spacing={2}  style={{padding: "1em"}}>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Admission</Typography>
            <Typography>
              Show all registered visitors coming for enquiries 
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View More</Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Registrar</Typography>
            <Typography>
              
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View More</Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Sports</Typography>
            <Typography>
              
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View More</Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Catering</Typography>
            <Typography>
              
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View More</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dep;
