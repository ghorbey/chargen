CREATE TABLE characters_skills (
    id SERIAL,
    character_id int,
    skill_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);