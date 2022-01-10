import { Alert } from '@mui/material';

export default function Error(props) {
    const { errorMessage } = props;
    if (errorMessage) {
        return (
            <Alert severity="error">
                {errorMessage}
            </Alert>
        );
    } else {
        return null;
    }
}