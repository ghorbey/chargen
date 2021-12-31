CREATE TABLE careers_skills (
    id SERIAL,
    career_id int,
    skill_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);