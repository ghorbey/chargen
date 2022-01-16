import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Grid, TextField, MenuItem, FormControlLabel, Checkbox, FormControl, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import { CharacterActions } from '../../components';
import { getCurrentUser } from '../../common';
import CharacterService from '../../services/Character.service';


const getRaceSkills = (globalData, race_id) => {
    const skillIdList = globalData.races_skills.filter(rs => rs.race_id === race_id).map(rs => rs.skill_id);
    return globalData.skills.filter(skill => skillIdList.includes(skill.id));
};

const getVocationCareers = (globalData, vocation_id) => {
    const careerList = globalData.careers.filter(career => career.vocation_id === vocation_id);
    return careerList;
};

const getAvailableReligions = (globalData, race_id) => {
    const religionList = globalData.religions.filter(religion => religion.race_id === race_id || religion.race_id === 0);
    return religionList;
}

const getBaseSkills = (skills, character_skills) => {
    const baseSkills = skills.filter(skill => skill.is_base === true && !character_skills.includes(skill.id));
    return baseSkills;
}

const getCharacterBaseSkills = (skills, character_skills) => {
    const characterBaseSkills = skills.filter(skill => skill.is_base === true && character_skills.includes(skill.id));
    return characterBaseSkills;
}

const getCareerSkills = (globalData, current_career_id, character_skills) => {
    const nonBaseSkills = globalData.skills.filter(skill => skill.is_base === false && !character_skills.includes(skill.id));
    const careerSkills = nonBaseSkills.filter(skill => globalData.careers_skills.filter(cs => cs.career_id === current_career_id).includes(skill.id));
    return careerSkills;
}

const getCharacterCareerSkills = (globalData, character_skills, character_careers) => {
    const nonBaseSkills = globalData.skills.filter(skill => skill.is_base === false && character_skills.includes(skill.id));
    const characterCareerSkills = nonBaseSkills.filter(skill => character_careers.includes(skill.id));
    return characterCareerSkills;
}

const getSelectedValue = (arrayOfId, selectedValue, character) => {
    const value = arrayOfId.length > 0 && character
        ? character.country_id && arrayOfId.includes(selectedValue)
            ? character.country_id
            : arrayOfId[0]
        : 0;
    return value;
}

const getCharacterCurrentCareerId = (globalData, character_careers, vocation_id) => {
    let currentCareerId = getVocationCareers(globalData, vocation_id)[0].id;
    if (character_careers?.length > 0) {
        const currentCareer = character_careers.find(cc => cc.is_current === true);
        if (currentCareer) {
            currentCareerId = currentCareer.id;
        }
    }
    return currentCareerId;
}

export default function Character(props) {
    const globalData = props.globalData;
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [character, setCharacter] = useState(props.character);
    const [selectedData, setSelectedData] = useState({ base_skills_id: getBaseSkills(globalData.skills, character.character_skills)[0] ? getBaseSkills(globalData.skills, character.character_skills)[0].id : 0 });
    const [isComputed, setIsComputed] = useState(false);
    const [raceSkills, setRaceSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const { isAdmin } = getCurrentUser();
    const navigate = useNavigate();
    const character_types = ['pj', 'pnj'];

    let careerSkillInput = undefined;
    let baseSkillInput = undefined;

    useEffect(() => {
        if (!isComputed && globalData && character) {
            setRaceSkills(getRaceSkills(globalData, character.race_id));
            setIsComputed(true);
        }
    }, [isComputed, globalData, character]);

    const prepareCharacter = (character) => {
        const copy = { ...character };
        return copy;
    }

    const updateField = (field, value) => {
        const copy = { ...character };
        copy[field] = value;
        setCharacter(copy);
    };

    const updateUnrelatedField = (field, value) => {
        console.log(field);
        console.log(value);
    };

    const updateRaceField = (field, value) => {
        updateField(field, value);
        const raceSkillsCopy = getRaceSkills(globalData, value);
        setRaceSkills(raceSkillsCopy);
    };

    const updateVocationField = (field, value) => {
        updateField(field, value);
        const vocationCareersCopy = getVocationCareers(globalData, value);
    };

    const updateCareerField = (field, value) => {
        updateField(field, value);
    };

    const updateDataField = (field, value) => {
        const copy = { ...selectedData };
        copy[field] = value;
        setSelectedData(copy);
    }

    const handleChangeCareer = () => {
        console.log('change career');
    };

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

    const handleEdit = () => {
        setIsEdit(true);
        navigate(`/character/${character.id}/edit`);
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

    const handlePrint = () => {
        console.log('print');
    };

    const addCareerSkill = () => {
        if (careerSkillInput?.value) {
            const copy = { ...character };
            copy.character_skills.push(careerSkillInput.value);
            setCharacter(copy);
        }
    };

    const clearCareerSkills = () => {
        const copy = { ...character };
        copy.character_skills = [];
        setCharacter(copy);
    };

    const addBaseSkill = () => {
        if (baseSkillInput?.value) {
            const copy = { ...character };
            const baseSkills = getBaseSkills(globalData.skills, character.character_skills).filter(skill => skill.id !== baseSkillInput.value);
            if (baseSkills.length > 0) {
                selectedData.base_skills_id = baseSkills[0].id;
            }
            copy.character_skills.push(baseSkillInput.value);
            setCharacter(copy);
        }
    };

    const clearBaseSkills = () => {
        const copy = { ...character };
        const baseSkills = getCharacterBaseSkills(globalData.skills, character.character_skills);
        copy.character_skills = copy.character_skills.filter(skillId => !baseSkills.map(s => s.id).includes(skillId));
        setCharacter(copy);
    };

    return (
        (character && isComputed) ?
            <>
                <CharacterActions isEdit={isEdit} errorMessage={errorMessage} handleSave={() => handleSave()} handleEdit={() => handleEdit()} handlePrint={() => handlePrint()} handleCancel={() => handleCancel()} />
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
                                defaultValue={getSelectedValue(globalData.countries.map(item => item.id), character.country_id, character)}
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
                                defaultValue={getSelectedValue(globalData.races.map(item => item.id), character.race_id, character)}
                                value={character.race_id}
                                onChange={(e) => updateRaceField(e.target.name, e.target.value)}
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
                                defaultValue={getSelectedValue(globalData.religions.map(item => item.id), character.religion_id, character)}
                                value={character.religion_id}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            >
                                {getAvailableReligions(globalData, character.race_id).map(religion => <MenuItem key={religion.id} value={religion.id}>{religion.religion_name}</MenuItem>)}
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
                                defaultValue={getSelectedValue(globalData.vocations.map(item => item.id), character.vocation_id, character)}
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
                                rows={raceSkills.length}
                                multiline
                                fullWidth
                                value={raceSkills.map(skill => skill.skill_name).join('\n')}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={5}>
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
                                defaultValue={getCharacterCurrentCareerId(globalData, character.careers, character.vocation_id)}
                                value={character.current_career_id}
                                onChange={(e) => updateCareerField(e.target.name, e.target.value)}
                            >
                                {getVocationCareers(globalData, character.vocation_id).map(career => <MenuItem key={career.id} value={career.id}>{career.career_name}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item lg={1}>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button color="primary" variant="outlined" onClick={handleChangeCareer} disabled={!isEdit} size="Large" sx={{ mt: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item lg={6}>
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
                        <Grid container spacing={2}>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="base_skills_id"
                                        inputProps={{ ref: input => baseSkillInput = input }}
                                        margin="normal"
                                        label="Compétences de base"
                                        name="base_skills_id"
                                        InputLabelProps={{ shrink: true }}
                                        select
                                        fullWidth
                                        defaultValue={selectedData.base_skills_id}
                                        value={selectedData.base_skills_id}
                                        onChange={(e) => updateDataField(e.target.name, e.target.value)}
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {getBaseSkills(globalData.skills, character.character_skills).map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addBaseSkill()} disabled={!isEdit} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="character_base_skills"
                                        margin="normal"
                                        label="Compétences de base acquises"
                                        name="character_base_skills"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                        rows={getCharacterBaseSkills(globalData.skills, character.character_skills).length}
                                        multiline
                                        fullWidth
                                        value={getCharacterBaseSkills(globalData.skills, character.character_skills).map(skill => skill.skill_name).join('\n')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearBaseSkills} disabled={!isEdit} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faMinus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid >
                    </Grid >
                    <Grid item lg={6}>
                        <Grid container spacing={2}>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="career_skills"
                                        inputProps={{ ref: input => careerSkillInput = input }}
                                        margin="normal"
                                        label="Compétences de carrière"
                                        name="career_skills"
                                        InputLabelProps={{ shrink: true }}
                                        select
                                        fullWidth
                                        value={getCareerSkills(globalData, character.current_career_id, character.character_skills)[0]?.id ? getCareerSkills(globalData, character.current_career_id, character.character_skills)[0].id : 0}
                                        onChange={(e) => updateUnrelatedField(e.target.name, e.target.value)}
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {getCareerSkills(globalData, character.current_career_id, character.character_skills).filter(skill => !character.character_skills.includes(skill.id)).map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addCareerSkill()} disabled={!isEdit} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="characters_skills"
                                        margin="normal"
                                        label="Compétences de carrière acquises"
                                        name="characters_skills"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                        rows={getCharacterCareerSkills(globalData, character.character_careers, character.character_skills).length}
                                        multiline
                                        fullWidth
                                        value={getCharacterCareerSkills(globalData, character.character_careers, character.character_skills).map(skill => skill.skill_name).join('\n')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearCareerSkills} disabled={!isEdit} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faMinus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
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
                </Grid >
            </>
            : (errorMessage)
                ? <Alert severity="information">{errorMessage}</Alert>
                : null
    );
}