import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Grid, TextField, MenuItem, FormControlLabel, Checkbox, FormControl, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import { CharacterActions } from '../../components';
import { getCurrentUser } from '../../common';
import CharacterService from '../../services/Character.service';
import * as methods from './character.methods'

export default function Character(props) {
    const globalData = props.globalData;
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [character, setCharacter] = useState(props.character);
    const [selectedData, setSelectedData] = useState({ base_skills_id: methods.getBaseSkills(globalData.skills, character.character_skills)[0] ? methods.getBaseSkills(globalData.skills, character.character_skills)[0].id : 0 });
    const [isComputed, setIsComputed] = useState(false);
    const [raceSkills, setRaceSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const { isAdmin } = getCurrentUser();
    const navigate = useNavigate();
    const character_types = ['pj', 'pnj'];

    let careerSkillInput = undefined;
    let baseSkillInput = undefined;

    let baseSkillList = [];
    let selectedBaseSkillId = 0;
    let characterBaseSkills = [];
    let numberOfCharacterBaseSkills = 0;

    let careerSkillList = [];
    let selectedCareerSkillId = 0;
    let characterCareerSkills = [];
    let numberOfCharacterCareerSkills = 0;

    //#region Update methods
    const updateCharacterField = (field, value) => {
        const copy = { ...character };
        copy[field] = value;
        setCharacter(copy);
    };

    const updateCharacterFields = (fields, values) => {
        const copy = { ...character };
        fields.forEach((field, index) => {
            copy[field] = values[index];
        });
        setCharacter(copy);
    };

    const updateVocationField = (field, vocation_id) => {
        const cci = methods.getSelectedCareerOnVocationId(globalData, vocation_id, character.current_career_id);
        updateCharacterFields(['vocation_id', 'current_career_id'], [vocation_id, cci]);
    };

    const updateUnrelatedField = (field, value) => {
        console.log(field);
        console.log(value);
    };

    const updateRaceField = (field, value) => {
        updateCharacterField(field, value);
        const raceSkillsCopy = methods.getRaceSkills(globalData, value);
        setRaceSkills(raceSkillsCopy);
    };

    const updateCareerField = (field, value) => {
        updateCharacterField(field, value);
    };

    const updateDataField = (field, value) => {
        const copy = { ...selectedData };
        copy[field] = value;
        setSelectedData(copy);
    }
    //#endregion

    //#region Initialization
    if (character) {
        character.visible_base_character_skills = globalData.skills.filter(skill => character.character_skills.includes(skill.id) && skill.is_base === true).map(skill => skill.id);
        character.visible_career_character_skills = globalData.skills.filter(skill => character.character_skills.includes(skill.id) && skill.is_base === false).map(skill => skill.id);
        character.visible_base_character_skill_names = globalData.skills.filter(skill => character.character_skills.includes(skill.id) && skill.is_base === true).map(skill => skill.skill_name);
        character.visible_career_character_skill_names = globalData.skills.filter(skill => character.character_skills.includes(skill.id) && skill.is_base === false).map(skill => skill.skill_name);
        if (character.current_career_id === 0) {
            const cci = methods.getSelectedCareerOnVocationId(globalData, character.vocation_id, character.current_career_id);
            character.current_career_id = cci;
            updateCharacterField('current_career_id', cci);
        }

        if (globalData && character.current_career_id && character.character_skills && character.character_careers) {
            baseSkillList = methods.getBaseSkills(globalData.skills, character.character_skills);
            selectedBaseSkillId = baseSkillList?.length > 0
                ? baseSkillList[0].id
                : 0;
            characterBaseSkills = methods.getCharacterBaseSkills(globalData.skills, character.character_skills);
            numberOfCharacterBaseSkills = characterBaseSkills?.length;

            careerSkillList = methods.getCareerSkills(globalData, character.current_career_id, character.character_skills);
            selectedCareerSkillId = careerSkillList?.length > 0
                ? careerSkillList[0].id
                : 0;
            characterCareerSkills = methods.getCharacterCareerSkills(globalData.skills, character.character_skills);
            numberOfCharacterCareerSkills = characterCareerSkills?.length;
        }
    }

    //#endregion

    //#region Skills methods
    const addCareerSkill = () => {
        if (careerSkillInput?.value) {
            const copy = { ...character };
            copy.character_skills.push(careerSkillInput.value);
            setCharacter(copy);
        }
    };

    const clearCareerSkills = () => {
        const copy = { ...character };
        const careerSkills = methods.getCharacterCareerSkills(globalData.skills, character.character_skills);
        copy.character_skills = copy.character_skills.filter(skillId => !careerSkills.map(s => s.id).includes(skillId));
        setCharacter(copy);
    };

    const addBaseSkill = () => {
        if (baseSkillInput?.value) {
            const copy = { ...character };
            const baseSkills = methods.getBaseSkills(globalData.skills, character.character_skills).filter(skill => skill.id !== baseSkillInput.value);
            if (baseSkills.length > 0) {
                selectedData.base_skills_id = baseSkills[0].id;
            }
            copy.character_skills.push(baseSkillInput.value);
            setCharacter(copy);
        }
    };

    const clearBaseSkills = () => {
        const copy = { ...character };
        const baseSkills = methods.getCharacterBaseSkills(globalData.skills, character.character_skills);
        copy.character_skills = copy.character_skills.filter(skillId => !baseSkills.map(s => s.id).includes(skillId));
        setCharacter(copy);
    };
    //#endregion

    //#region Form actions methods
    const handleChangeCareer = () => {
        console.log('change career');
    };

    // TODO: Check if removable?
    const prepareCharacter = (character) => {
        const copy = { ...character };
        // copy.character_skills = [];
        // if (copy.visible_base_character_skills?.length > 0) {
        //     copy.character_skills = copy.character_skills.concat(copy.visible_base_character_skills.map(skill => skill.id));
        // }
        // if (copy.visible_career_character_skills?.length > 0) {
        //     copy.character_skills = copy.character_skills.concat(copy.visible_career_character_skills.map(skill => skill.id));
        // }
        // console.log(copy.character_skills);
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
    //#endregion

    //#region Hooks
    useEffect(() => {
        if (!isComputed && globalData && character) {
            setRaceSkills(methods.getRaceSkills(globalData, character.race_id));
            setIsComputed(true);
        }
    }, [isComputed, globalData, character]);
    //#endregion

    //#region Rendering
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                select
                                value={character.user_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                            >
                                {globalData.users.map(user => <MenuItem key={user.id} value={user.id}>{user.user_firstname} {user.user_lastname}</MenuItem>)}
                            </TextField>
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                defaultValue={methods.getSelectedValue(globalData.countries.map(item => item.id), character.country_id, character)}
                                value={character.country_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                defaultValue={methods.getSelectedValue(globalData.races.map(item => item.id), character.race_id, character)}
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
                                defaultValue={methods.getSelectedValue(globalData.religions.map(item => item.id), character.religion_id, character)}
                                value={character.religion_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                            >
                                {methods.getAvailableReligions(globalData, character.race_id).map(religion => <MenuItem key={religion.id} value={religion.id}>{religion.religion_name}</MenuItem>)}
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
                                defaultValue={methods.getSelectedValue(globalData.vocations.map(item => item.id), character.vocation_id, character)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                defaultValue={methods.getSelectedCareerOnVocationId(globalData, character.vocation_id, character.current_career_id)}
                                value={character.current_career_id}
                                onChange={(e) => updateCareerField(e.target.name, e.target.value)}
                            >
                                {methods.getVocationCareers(globalData, character.vocation_id).map(career => <MenuItem key={career.id} value={career.id}>{career.career_name}</MenuItem>)}
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
                                        disabled={!isEdit || !baseSkillList || baseSkillList?.length === 0}
                                        select
                                        fullWidth
                                        value={selectedBaseSkillId}
                                        onChange={(e) => updateDataField(e.target.name, e.target.value)}
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {baseSkillList.map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addBaseSkill()} disabled={!isEdit || !baseSkillList || baseSkillList?.length === 0} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="visible_character_base_skills"
                                        margin="normal"
                                        label="Compétences de base acquises"
                                        name="visible_character_base_skills"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                        rows={numberOfCharacterBaseSkills}
                                        multiline
                                        fullWidth
                                        value={character.visible_base_character_skill_names.join('\n')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearBaseSkills} disabled={!isEdit || !characterBaseSkills || characterBaseSkills?.length === 0} sx={{ mt: 2, height: 56 }}>
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
                                        disabled={!isEdit || !careerSkillList || careerSkillList?.length === 0}
                                        select
                                        fullWidth
                                        value={selectedCareerSkillId}
                                        onChange={(e) => updateUnrelatedField(e.target.name, e.target.value)}
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {careerSkillList.map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addCareerSkill()} disabled={!isEdit || !careerSkillList || careerSkillList?.length === 0} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="visible_career_character_skills"
                                        margin="normal"
                                        label="Compétences de carrière acquises"
                                        name="visible_career_character_skills"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                        rows={numberOfCharacterCareerSkills}
                                        multiline
                                        fullWidth
                                        value={character.visible_career_character_skill_names.join('\n')}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearCareerSkills} disabled={!isEdit || !characterCareerSkills || characterCareerSkills?.length === 0} sx={{ mt: 2, height: 56 }}>
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
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
    //#endregion
}