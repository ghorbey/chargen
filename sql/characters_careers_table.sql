CREATE TABLE characters_careers (
    id SERIAL,
    character_id int,
    career_id int,
    is_current boolean,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id)
);