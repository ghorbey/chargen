import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Grid, TextField, MenuItem, FormControlLabel, Checkbox, FormControl, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import { CharacterActions, MultipleTextArea } from '../../components';
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
    const { isAdmin, isPnj } = getCurrentUser();
    const navigate = useNavigate();
    const character_types = ['pj', 'pnj'];
    const listSeparator = ', ';

    let careerSkillInput = undefined;
    let baseSkillInput = undefined;

    let baseSkillList = [];
    let selectedBaseSkillId = 0;
    let characterBaseSkills = [];

    let careerSkillList = [];
    let selectedCareerSkillId = 0;
    let characterCareerSkills = [];

    let characterCareers = [];

    const blankPersonalQuest = { character_id: character?.id, content: '', is_completed: false };
    const blankChapter = { character_id: character?.id, content: '', sort_order: 0 };
    const blankAnnexe = { character_id: character?.id, content: '' };

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
        const cci = methods.getSelectedCareerOnVocationId(globalData, vocation_id, character.current_career_id, character.character_careers);
        updateCharacterFields(['vocation_id', 'current_career_id'], [vocation_id, cci]);
    };

    const updateUnrelatedField = (field, value) => {
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
            const cci = methods.getSelectedCareerOnVocationId(globalData, character.vocation_id, character.current_career_id, character.character_careers);
            character.current_career_id = cci;
            updateCharacterField('current_career_id', cci);
        }

        if (globalData && character.vocation_id && character.character_careers) {
            characterCareers = methods.getVocationCareers(globalData, character.vocation_id).filter(career => character.character_careers.includes(career.id));
        }

        if (globalData && character.current_career_id && character.character_skills && character.character_careers) {
            baseSkillList = methods.getBaseSkills(globalData.skills, character.character_skills);
            selectedBaseSkillId = baseSkillList?.length > 0
                ? baseSkillList[0].id
                : 0;
            characterBaseSkills = methods.getCharacterBaseSkills(globalData.skills, character.character_skills);
            careerSkillList = methods.getCareerSkills(globalData, character.current_career_id, character.character_skills);
            selectedCareerSkillId = careerSkillList?.length > 0
                ? careerSkillList[0].id
                : 0;
            characterCareerSkills = methods.getCharacterCareerSkills(globalData.skills, character.character_skills);
        }
    }

    const isDisabledBase = () => {
        return !isEdit;
    };

    const isDisabledForPlayer = () => {
        return !isAdmin || !isPnj || !isEdit;
    };

    const isDisabledForPlayerEdition = () => {
        return (!isAdmin || !isPnj || !isEdit) && character.id > 0;
    };
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
    const handleChangeCareer = (current_career_id) => {
        const copy = { ...character };
        copy.character_careers.push(current_career_id);
        copy.current_career_id = methods.getSelectedCareerOnVocationId(globalData, character.vocation_id, 0, character.character_careers);
        setCharacter(copy);
    };

    const clearCareers = () => {
        const copy = { ...character };
        copy.character_careers = [];
        setCharacter(copy);
    }

    // TODO: Check if removable?
    const prepareCharacter = (character) => {
        const copy = { ...character };
        copy.character_careers = copy.character_careers
            .map(cc => { return { career_id: cc, is_current: false } })
            .concat([{ career_id: character.current_career_id, is_current: true }]);
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

    const handlePrintPreview = () => {
        navigate(`/character/${character.id}/print-preview`);
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
                <CharacterActions isEdit={isEdit} errorMessage={errorMessage} handleSave={() => handleSave()} handleEdit={() => handleEdit()} handlePrint={() => handlePrintPreview()} handleCancel={() => handleCancel()} />
                <Grid container spacing={2} id="character-sheet">
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="character_name"
                                margin="normal"
                                label="Nom du personnage"
                                name="character_name"
                                InputLabelProps={{ shrink: true }}
                                disabled={isDisabledBase()}
                                autoComplete="off"
                                value={character.character_name}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                autoFocus
                                fullWidth
                                required
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                defaultValue={character_types[0]}
                                value={character.character_type}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                value={character.character_number}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                value={character.user_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                value={character.fate_points}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                defaultValue={methods.getSelectedValue(globalData.countries.map(item => item.id), character.country_id, character)}
                                value={character.country_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                defaultValue={methods.getSelectedValue(globalData.races.map(item => item.id), character.race_id, character)}
                                value={character.race_id}
                                onChange={(e) => updateRaceField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                defaultValue={methods.getSelectedValue(globalData.religions.map(item => item.id), character.religion_id, character)}
                                value={character.religion_id}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                defaultValue={methods.getSelectedValue(globalData.vocations.map(item => item.id), character.vocation_id, character)}
                                value={character.vocation_id}
                                onChange={(e) => updateVocationField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
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
                                autoComplete="off"
                                value={raceSkills.map(skill => skill.skill_name).join(listSeparator)}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                disabled
                                multiline
                                fullWidth
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
                                disabled={isDisabledBase()}
                                autoComplete="off"
                                defaultValue={methods.getSelectedCareerOnVocationId(globalData, character.vocation_id, character.current_career_id, character.character_careers)}
                                value={character.current_career_id}
                                onChange={(e) => updateCareerField(e.target.name, e.target.value)}
                                fullWidth
                                required
                                select
                            >
                                {methods.getVocationCareers(globalData, character.vocation_id).map(career => <MenuItem key={career.id} value={career.id}>{career.career_name}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item lg={1} sx={{ displayPrint: 'none' }}>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button color="primary" variant="outlined" onClick={() => handleChangeCareer(character.current_career_id)} disabled={isDisabledForPlayer()} size="Large" sx={{ mt: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item lg={6}>
                        <Grid container spacing={2}>
                            <Grid item lg={10}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="character_careers"
                                        margin="normal"
                                        label="Historique des carrières"
                                        name="character_careers"
                                        InputLabelProps={{ shrink: true }}
                                        autoComplete="off"
                                        value={characterCareers.map(career => career.career_name).join(listSeparator)}
                                        disabled
                                        multiline
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sx={{ displayPrint: 'none' }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => clearCareers()} disabled={isDisabledForPlayer() || !characterCareers || characterCareers?.length === 0} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faMinus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
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
                                        disabled={isDisabledBase() || !baseSkillList || baseSkillList?.length === 0}
                                        autoComplete="off"
                                        value={selectedBaseSkillId}
                                        onChange={(e) => updateDataField(e.target.name, e.target.value)}
                                        select
                                        fullWidth
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {baseSkillList.map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sx={{ displayPrint: 'none' }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addBaseSkill()} disabled={isDisabledForPlayerEdition() || !baseSkillList || baseSkillList?.length === 0} sx={{ mt: 2, height: 56 }}>
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
                                        autoComplete="off"
                                        value={character.visible_base_character_skill_names.join(listSeparator)}
                                        disabled
                                        multiline
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sx={{ displayPrint: 'none' }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearBaseSkills} disabled={isDisabledForPlayerEdition() || !characterBaseSkills || characterBaseSkills?.length === 0} sx={{ mt: 2, height: 56 }}>
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
                                        disabled={isDisabledBase() || !careerSkillList || careerSkillList?.length === 0}
                                        autoComplete="off"
                                        value={selectedCareerSkillId}
                                        onChange={(e) => updateUnrelatedField(e.target.name, e.target.value)}
                                        select
                                        fullWidth
                                    >
                                        <MenuItem key={0} value={0}></MenuItem>
                                        {careerSkillList.map(skill => <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>)}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sx={{ displayPrint: 'none' }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={(e) => addCareerSkill()} disabled={isDisabledForPlayerEdition() || !careerSkillList || careerSkillList?.length === 0} sx={{ mt: 2, height: 56 }}>
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
                                        autoComplete="off"
                                        value={character.visible_career_character_skill_names.join(listSeparator)}
                                        disabled
                                        multiline
                                        fullWidth
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={2} sx={{ displayPrint: 'none' }}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button color="primary" variant="outlined" onClick={clearCareerSkills} disabled={isDisabledForPlayerEdition() || !characterCareerSkills || characterCareerSkills?.length === 0} sx={{ mt: 2, height: 56 }}>
                                        <FontAwesomeIcon icon={faMinus} size="lg" />
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="current_xp"
                                margin="normal"
                                label="XP actuels"
                                name="current_xp"
                                InputLabelProps={{ shrink: true }}
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                value={character.current_xp}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="total_xp"
                                margin="normal"
                                label="XP acquis"
                                name="total_xp"
                                InputLabelProps={{ shrink: true }}
                                disabled={isDisabledForPlayer()}
                                autoComplete="off"
                                value={character.total_xp}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControlLabel control={<Checkbox disabled />} label="XP Scénario" />
                    </Grid>
                    <Grid item lg={6}>
                        <FormControlLabel control={<Checkbox disabled />} label="XP roleplay" />
                    </Grid>
                    <Grid item lg={12}>
                        <MultipleTextArea data={character.character_personal_quests} title={'Quête personnelle'} id={character.id} isDisabled={isDisabledBase()} blankItem={blankPersonalQuest} label={'Quête'} name={'personal_quest'} />
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField
                                id="public_legend"
                                margin="normal"
                                label="Légende publique"
                                name="public_legend"
                                InputLabelProps={{ shrink: true }}
                                disabled={isDisabledForPlayerEdition()}
                                autoComplete="off"
                                value={character.public_legend}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)}
                                fullWidth
                                multiline
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <TextField id="background" margin="normal" label="Background" name="background" InputLabelProps={{ shrink: true }} disabled={isDisabledForPlayerEdition()} autoComplete="off" fullWidth multiline value={character.background}
                                onChange={(e) => updateCharacterField(e.target.name, e.target.value)} />
                        </FormControl>
                    </Grid>
                    <Grid item lg={12}>
                        <MultipleTextArea data={character.character_chapters} title={'Chapitres'} id={character.id} isDisabled={isDisabledBase()} blankItem={blankChapter} label={'Chapitre'} name={'chapter'} />
                    </Grid>
                    <Grid item lg={12}>
                        <MultipleTextArea data={character.character_annexes} title={'Annexes'} id={character.id} isDisabled={isDisabledBase()} blankItem={blankAnnexe} label={'Annexe'} name={'annexe'} />
                    </Grid>
                </Grid >
            </>
            : (errorMessage)
                ? <Alert severity="information">{errorMessage}</Alert>
                : null
    );
    //#endregion
}