export default function createNewCharacter(id, userId) {
    if (+id === 0) {
        return {
            id: 0,
            user_id: +userId,
            character_name: '',
            character_type: 'pj',
            character_number: '000',
            fate_points: 2,
            country_id: 1,
            race_id: 1,
            religion_id: 1,
            vocation_id: 1,
            current_xp: 0,
            total_xp: 0,
            public_legend: '',
            background: '',
            current_career_id: 19,
            character_skills: [],
            character_personal_quests: [],
            character_chapters: [],
            character_careers: [],
            character_annexes: [],
            career_plan: ''
        };
    } else {
        return undefined;
    }
}