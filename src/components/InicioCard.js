import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const InicioCard = ({ title, description, icon }) => (
  <Card sx={{ maxWidth: 340, width: '100%', mx: 0, my: 2, boxShadow: 4, borderRadius: 3, minHeight: 210, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        {icon && <Box sx={{ fontSize: 48, color: '#27ae60', mb: 1 }}>{icon}</Box>}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#27ae60', mb: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', textAlign: 'center' }}>
          {description}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default InicioCard;
