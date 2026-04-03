import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import ChartCard from '../components/ChartCard';

export default function Dashboard() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ChartCard title="Vulnérabilités par criticité" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <ChartCard title="Temps moyen de résolution" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
