import React from 'react';
import { Button, Alert } from '@mui/material';

export default function Character(props) {
    const { character, isEdit, save, cancel, edit } = props;

    const handleSave = () => {
        save(character);
    };

    const handleEdit = () => {
        edit(character);
    };

    if (character) {
        if (isEdit) {
            return (
                <>
                    <Button color="primary" variant="outlined" onClick={cancel}>Cancel</Button>
                    <Button color="primary" variant="outlined" onClick={handleSave}>Save</Button>
                    <Alert severity="info">Edit {character?.character_name}</Alert>
                </>
            );
        } else {
            return (
                <>
                    <Button color="primary" variant="outlined" onClick={handleEdit}>Edit</Button>
                    <Alert severity="info">View {character?.character_name}</Alert>
                </>
            );
        }
    } else {
        return (
            <Alert severity="info">Aucun personnage disponible</Alert>
        );
    }
}