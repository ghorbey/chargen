import { Button } from '@mui/material';

export default function CreateCharacterButton(props) {
    const { create, isVisible } = props;

    if (isVisible) {
        return (
            <Button color="primary" variant="outlined" onClick={create}>
                Create new character
            </Button>
        );
    } else {
        return null;
    }

}