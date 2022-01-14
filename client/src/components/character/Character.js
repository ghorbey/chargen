import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Grid, TextField, MenuItem, FormControlLabel, Checkbox, FormControl } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faSave, faBan } from '@fortawesome/free-solid-svg-icons';

import { Error } from '../../components';
import { getCurrentUser } from '../../common';
import CharacterService from '../../services/Character.service';

export default function Character(props) {
    const [globalData] = useState(props.globalData);
    const [computedData, setComputedData] = useState({ racesSkills: [], chapters: [], annexes: [], isComputed: false });
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [character, setCharacter] = useState(props.character);
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();
    const { isAdmin } = getCurrentUser();
    const character_types = ['pj', 'pnj'];

    const prepareCharacter = (character) => {
        const copy = { ...character };
        return copy;
    }

    const handleSave = () => {
        const preparedCharacter = prepareCharacter(character);
        if (preparedCharacter.id) {
            CharacterService
                .update([preparedCharacter])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                        navigate(`/character/${character.id}/view`);
                    }
                    setErrorMessage(message);
                });
        } else {
            CharacterService
                .add([preparedCharacter])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setIsEdit(false);
                        navigate(`/character/${character.id}/view`);
                    }
                    setErrorMessage(message);
                });
        }
    };

    const updateField = (field, value) => {
        const copy = { ...character };
        copy[field] = value;
        setCharacter(copy);
    };

    const updateComputableField = (field, value) => {
        updateField(field, value);
        const copy = { ...computedData };
        copy.isComputed = false;
        setComputedData(copy);
    }

    const updateVocationField = (field, value) => {
        updateField(field, value);
        //const filteredCareers = globalData.careers.filter(career => !character?.career_history?.includes(career.id) && career.vocation_id === value);
    };

    const handleCancel = () => {
        if (character?.id && !isAdmin) {
            setIsEdit(false);
            navigate(`/character/${character.id}/view`);
        } else if (character?.id && isAdmin) {
            navigate('/character-list');
        } else {
            navigate('/character-list');
        }
    };

    const handleEdit = () => {
        setIsEdit(true);
        navigate(`/character/${character.id}/edit`);
    };

    const handleChangeCareer = () => {
        console.log('change career');
    };

    useEffect(() => {
        const getRaceSkills = (globalData, race_id) => {
            const skillIdList = globalData.races_skills.filter(rs => rs.race_id === race_id).map(rs => rs.skill_id);
            return globalData.skills.filter(skill => skillIdList.includes(skill.id));
        };

        if (!computedData.isComputed && globalData && character) {
            const racesSkills = getRaceSkills(globalData, character.race_id);
            const availableCareers = globalData.careers;
            setComputedData({
                racesSkills,
                availableCareers,
                isComputed: true
            });
        }
    }, [computedData, globalData, character]);


    return (
        (character && computedData?.isComputed) ?
            <>
                <Grid container spacing={2}>
                    <Grid item xl={12}>
                        {!isEdit && isAdmin
                            ? <Button color="primary" variant="outlined" component={Link} to={isAdmin ? '/character-list' : '/character/user/view'} sx={{ mr: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                            </Button>
                            : null
                        }
                        {isEdit
                            ? <Button color="primary" variant="outlined" onClick={handleCancel} sx={{ mr: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faBan} size="lg" />
                            </Button>
                            : null
                        }
                        <Button color="primary" variant="outlined" onClick={isEdit ? handleSave : handleEdit} sx={{ mr: 2, height: 56 }}>
                            {!isEdit ? <FontAwesomeIcon icon={faEdit} size="lg" /> : <FontAwesomeIcon icon={faSave} size="lg" />}
                        </Button>
                    </Grid>
                    <Grid item xl={12}>
                        <Error errorMessage={errorMessage} />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={2}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={10}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={2}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
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
                                onChange={(e) => updateComputableField(e.target.name, e.target.value)}
                            >
                                {globalData.races.map(race => <MenuItem key={race.id} value={race.id}>{race.race_name}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
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
                                onChange={(e) => updateVocationField(e.target.name, e.target.value)}
                            >
                                {globalData.vocations.map(vocation => <MenuItem key={vocation.id} value={vocation.id}>{vocation.vocation_name}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
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
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="current_career_id"
                                margin="normal"
                                label="Carrière actuelle"
                                name="current_career_id"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                required
                                select
                                value={character.current_career_id}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            >
                                {computedData.availableCareers.map(career => <MenuItem key={career.id} value={career.id}>{career.career_name}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2}>
                        <Button color="primary" variant="outlined" onClick={handleChangeCareer} disabled={!isEdit} size="Large" sx={{ mt: 2, height: 56 }}>Changer &gt;&gt;</Button>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
                            <TextField
                                id="character_careers"
                                margin="normal"
                                label="Historique des carrières"
                                name="character_careers"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                rows={character.character_careers.length}
                                multiline
                                fullWidth
                                value={character.character_careers.map(career => career.career_name).join('\n')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="base_skills"
                                margin="normal"
                                label="Compétences de base"
                                name="base_skills"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                rows={globalData.skills.filter(skill => skill.is_base).length}
                                multiline
                                fullWidth
                                value={globalData.skills.filter(skill => skill.is_base).map(skill => skill.skill_name).join('\n')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="career_skills"
                                margin="normal"
                                label="Compétences de carrière"
                                name="career_skills"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                rows={character.character_skills.filter(skill => skill.is_base).length}
                                multiline
                                fullWidth
                                value={character.character_skills.filter(skill => skill.is_base).map(skill => skill.skill_name).join('\n')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
                            Quête personnelle
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
                            <TextField
                                id="current_xp"
                                margin="normal"
                                label="XP actuels"
                                name="current_xp"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                required
                                value={character.current_xp}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControl fullWidth>
                            <TextField
                                id="total_xp"
                                margin="normal"
                                label="XP acquis"
                                name="total_xp"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                required
                                value={character.current_xp}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={4}>
                        <FormControlLabel control={<Checkbox disabled />} label="XP Scénario" />
                    </Grid>
                    <Grid item lg={4}>
                        <FormControlLabel control={<Checkbox disabled />} label="XP roleplay" />
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="public_legend"
                                margin="normal"
                                label="Légende publique"
                                name="public_legend"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                multiline
                                value={character.public_legend}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="background"
                                margin="normal"
                                label="Background"
                                name="background"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                multiline
                                value={character.background}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="chapters"
                                margin="normal"
                                label="Chapitres"
                                name="chapters"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                value={character.character_chapters.map(chapter => chapter).join('\n')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="annexes"
                                margin="normal"
                                label="Annexes"
                                name="annexes"
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEdit}
                                fullWidth
                                value={character.character_annexes.map(annex => annex).join('\n')}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </>
            : (errorMessage)
                ? <Alert severity="information">{errorMessage}</Alert>
                : null
    );
}