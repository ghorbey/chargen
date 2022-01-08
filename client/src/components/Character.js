import React from 'react';
import { Button, Alert, Container } from '@mui/material';

export default function Character(props) {
    const { character, isEdit, save, cancel, edit, create } = props;
    console.log(character);
    const handleSave = (event) => {
        save(character);
    };

    if (!character?.user_id) {
        return (
            <Button color="primary" variant="outlined" onClick={create}>
                Create new character
            </Button>
        );
    } else if (isEdit) {
        return (
            <>
                <Container>
                    <Alert severity="info">Edit {character.character_name}</Alert>
                    <Button color="primary" variant="outlined" onClick={cancel}>Cancel</Button>
                    <Button color="primary" variant="outlined" onClick={handleSave}>Save</Button>
                </Container>
            </>
        );
    } else {
        return (
            <>
                <Alert severity="info">View {character.character_name}</Alert>
                <Button color="primary" variant="outlined" onClick={edit}>Edit</Button>
            </>
        );
    }
}