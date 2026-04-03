import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function ChartCard({ title }: { title: string }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <div style={{ height: 150 }}>[chart placeholder]</div>
      </CardContent>
    </Card>
  );
}
