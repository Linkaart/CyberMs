import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function AuditLog() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2 }}>Audit Log</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        {/* TODO: implement audit log table with RBAC-filtered access */}
      </Paper>
    </Container>
  );
}
