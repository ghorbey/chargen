import { CircularProgress, Box } from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <CircularProgress />
        </Box>
    );
}