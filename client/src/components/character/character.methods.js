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

const getCareerSkills = (globalData, current_career_id, character_skills) => {
    const nonBaseSkillList = globalData.skills.filter(skill => skill.is_base === false && !character_skills.includes(skill.id));
    const currentCareerSkillList = nonBaseSkillList.filter(skill => globalData.careers_skills.filter(cs => cs.career_id === current_career_id).map(cs => cs.skill_id).includes(skill.id));
    return currentCareerSkillList;
}

const getSelectedCareerOnVocationId = (globalData, vocation_id, current_career_id) => {
    const careers = getVocationCareers(globalData, vocation_id);
    if ((current_career_id === 0 || !careers.map(career => career.id).includes(current_career_id)) && careers?.length > 0) {
        return careers[0].id;
    } else {
        return 0;
    }
}

const getCharacterBaseSkills = (skills, character_skills) => {
    const characterBaseSkills = skills.filter(skill => skill.is_base === true && character_skills.includes(skill.id));
    return characterBaseSkills;
}

const getCharacterCareerSkills = (skills, character_skills) => {
    const characterCareerSkills = skills.filter(skill => skill.is_base === false && character_skills.includes(skill.id));
    return characterCareerSkills;
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

const getSelectedValue = (arrayOfId, selectedValue, character) => {
    const value = arrayOfId.length > 0 && character
        ? character.country_id && arrayOfId.includes(selectedValue)
            ? character.country_id
            : arrayOfId[0]
        : 0;
    return value;
}

export { getRaceSkills, getVocationCareers, getAvailableReligions, getBaseSkills, getCharacterBaseSkills, getCareerSkills, getCharacterCareerSkills, getSelectedValue, getCharacterCurrentCareerId, getSelectedCareerOnVocationId };