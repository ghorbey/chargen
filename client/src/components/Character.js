import React, { useState } from 'react';
import { Button, Alert, Grid, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../common';

export default function Character(props) {
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [character, setCharacter] = useState(props.character);
    const [originalCharacter, setOriginalCharacter] = useState(props.character);
    const navigate = useNavigate();
    const { isAdmin } = getCurrentUser();
    const character_types = ['pj', 'pnj'];
    const countries = [
        { id: 1, country_name: 'Principautés Frontalières' },
        { id: 2, country_name: 'Bretonie' }
    ];
    const races = [
        { id: 1, race_name: 'Humain' },
        { id: 2, race_name: 'Elfe' },
        { id: 3, race_name: 'Nain' },
        { id: 4, race_name: 'Autre' }
    ];
    const religions = [
        { id: 1, religion_name: 'Tous' },
        { id: 2, religion_name: 'Sigmar' },
        { id: 3, religion_name: 'Ulric' },
        { id: 4, religion_name: 'Mórr' },
        { id: 5, religion_name: 'Ranald' },
        { id: 6, religion_name: 'Shallya' },
        { id: 7, religion_name: 'Aucun' },
        { id: 8, religion_name: 'Autre' }
    ];

    const handleSave = () => {
        console.log('save');
        console.log(character);
        setIsEdit(false);
        // if (savedCharacter.id) {
        //     CharacterService
        //         .update([savedCharacter])
        //         .then(response => {
        //             const { isSuccessful, message } = response;
        //             if (isSuccessful) {
        //                 setIsEdit(false);
        //             }
        //             setErrorMessage(message);
        //         });
        // } else {
        //     CharacterService
        //         .add([savedCharacter])
        //         .then(response => {
        //             const { isSuccessful, message } = response;
        //             if (isSuccessful) {
        //                 setIsEdit(false);
        //             }
        //             setErrorMessage(message);
        //         });
        // }
    };

    const updateField = (field, value) => {
        const copy = {...character};
        copy[field] = value;
        setCharacter(copy);
    }

    const handleCancel = () => {
        setCharacter({...originalCharacter});
        setIsEdit(false);
    };

    const handleBack = () => {
        if (isAdmin) {
            navigate('/character-list');
        } else {
            navigate('/character/user/view');
        }
    }

    const handleEdit = () => {
        setOriginalCharacter({...character});
        setIsEdit(true);
    };

    if (character) {
        return (
            <>
                {!isEdit
                    ? <Button color="primary" variant="outlined" onClick={handleBack}>Retour</Button>
                    : null
                }
                {isEdit
                    ? <Button color="primary" variant="outlined" onClick={handleCancel}>Annuler</Button>
                    : null
                }
                <Button color="primary" variant="outlined" onClick={isEdit ? handleSave : handleEdit}>{!isEdit ? 'Éditer' : 'Enregistrer'}</Button>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <TextField
                            id="character_name"
                            margin="normal"
                            label="Nom du personnage"
                            name="character_name"
                            InputLabelProps={{ shrink: true }}
                            autoFocus
                            disabled={!isEdit}
                            fullWidth
                            required
                            defaultValue={character.character_name}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={2}>
                        <TextField
                            id="character_type"
                            margin="normal"
                            label="Type"
                            name="character_type"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            select
                            defaultValue={character.character_type}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {character_types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item lg={4}>
                        <TextField
                            id="character_number"
                            margin="normal"
                            label="Numéro"
                            name="character_number"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            defaultValue={character.character_number}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={10}>
                        <TextField
                            id="user_id"
                            margin="normal"
                            label="Joueur"
                            name="user_id"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            defaultValue={character.user_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={2}>
                        <TextField
                            id="fate_points"
                            margin="normal"
                            label="Points de destin"
                            name="fate_points"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            defaultValue={character.fate_points}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={4}>
                        <TextField
                            id="country_id"
                            margin="normal"
                            label="Pays d'origine"
                            name="country_id"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            select
                            defaultValue={character.country_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {countries.map(country => <MenuItem key={country.id} value={country.id}>{country.country_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item lg={4}>
                        <TextField
                            id="race_id"
                            margin="normal"
                            label="Race"
                            name="race_id"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            select
                            defaultValue={character.race_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {races.map(race => <MenuItem key={race.id} value={race.id}>{race.race_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item lg={4}>
                        <TextField
                            id="religion_id"
                            margin="normal"
                            label="Religion"
                            name="religion_id"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            select
                            defaultValue={character.religion_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {religions.map(religion => <MenuItem key={religion.id} value={religion.id}>{religion.religion_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                </Grid>
            </>
        );
    } else {
        return (
            <Alert severity="info">Aucun personnage disponible</Alert>
        );
    }
}