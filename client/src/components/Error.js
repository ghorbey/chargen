import { Grid, Alert } from '@mui/material';

export default function Error(props) {
    const { errorMessage } = props;
    if (errorMessage) {
        return (
            <Grid container>
                <Grid item>
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
}