import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Variants() {
  return (
    <Stack spacing={1} alignItems="center"> 
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="text" width='80%' sx={{ fontSize: '44px', backgroundColor: '#646464' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="text" width='80%' sx={{ fontSize: '44px', backgroundColor: '#646464' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="text" width='80%' sx={{ fontSize: '44px', backgroundColor: '#646464' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="text" width='80%' sx={{ fontSize: '44px', backgroundColor: '#646464' }} />
      </div>
    </Stack>
  );
}
