import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Grid, TextField, MenuItem } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error } from '../components';
import { getCurrentUser } from '../common';


export const Character = (props) => {
    const [computedData, setComputedData] = useState({ racesSkills: [], isComputed: false });
    const [globalData] = useState(props.globalData);
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [character, setCharacter] = useState(props.character);
    const [errorMessage, setErrorMessage] = useState();
    const { isAdmin } = getCurrentUser();
    const character_types = ['pj', 'pnj'];

    const handleSave = () => {
        setIsEdit(false);
        if (character.id) {
            CharacterService
                .update([character])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                    }
                    setErrorMessage(message);
                });
        } else {
            CharacterService
                .add([character])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                    }
                    setErrorMessage(message);
                });
        }
    };

    const updateField = (field, value) => {
        const copy = { ...character };
        copy[field] = value;
        setCharacter(copy);
    }

    const handleCancel = () => {
        setCharacter(props.character);
        setIsEdit(false);
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    useEffect(() => {
        const getRaceSkills = (globalData, race_id) => {
            const skillIdList = globalData.races_skills.filter(rs => rs.race_id === race_id).map(rs => rs.skill_id);
            return globalData.skills.filter(skill => skillIdList.includes(skill.id));
        };
        if (!computedData.isComputed && globalData && character) {
            const racesSkills = getRaceSkills(globalData, character.race_id);
            console.log(racesSkills);
            setComputedData({
                racesSkills,
                isComputed: true
            });
        }
    }, [globalData, character, computedData, setComputedData]);

    return (
        (character && computedData?.isComputed) ?
            <>
                <Grid container spacing={2}>
                    <Grid item xl={12}>
                        {!isEdit && isAdmin
                            ? <Button color="primary" component={Link} to={isAdmin ? '/character-list' : '/character/user/view'} variant="outlined" sx={{ mr: 2 }}>Retour</Button>
                            : null
                        }
                        {isEdit
                            ? <Button color="primary" variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>Annuler</Button>
                            : null
                        }
                        <Button color="primary" variant="outlined" onClick={isEdit ? handleSave : handleEdit}>{!isEdit ? 'Éditer' : 'Enregistrer'}</Button>
                    </Grid>
                    <Grid item xl={12}>
                        <Error errorMessage={errorMessage} />
                    </Grid>
                </Grid>
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
                            value={character.character_name}
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
                            defaultValue={character_types[0]}
                            value={character.character_type}
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
                            type="string"
                            disabled={!isEdit}
                            fullWidth
                            required
                            value={character.character_number}
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
                            disabled={!isEdit || !isAdmin}
                            fullWidth
                            required
                            value={character.user_id}
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
                            value={character.fate_points}
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
                            value={character.country_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {globalData.countries.map(country => <MenuItem key={country.id} value={country.id}>{country.country_name}</MenuItem>)}
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
                            value={character.race_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {globalData.races.map(race => <MenuItem key={race.id} value={race.id}>{race.race_name}</MenuItem>)}
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
                            value={character.religion_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {globalData.religions.map(religion => <MenuItem key={religion.id} value={religion.id}>{religion.religion_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField
                            id="vocation_id"
                            margin="normal"
                            label="Vocation"
                            name="vocation_id"
                            InputLabelProps={{ shrink: true }}
                            disabled={!isEdit}
                            fullWidth
                            required
                            select
                            value={character.vocation_id}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {globalData.vocations.map(vocation => <MenuItem key={vocation.id} value={vocation.id}>{vocation.vocation_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField
                            id="race_skills"
                            margin="normal"
                            label="Compétences de race"
                            name="race_skills"
                            InputLabelProps={{ shrink: true }}
                            disabled
                            rows={computedData.racesSkills.length}
                            multiline
                            fullWidth
                            value={computedData.racesSkills.map(skill => skill.skill_name).join('\n')}
                            onChange={(e) => updateField(e.target.name, e.target.value)}
                        >
                            {computedData.racesSkills.map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                        </TextField>
                    </Grid>
                </Grid>
            </>
            : <Alert severity="info">Aucun personnage disponible</Alert>
    );
}