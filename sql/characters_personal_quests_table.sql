CREATE TABLE characters_personal_quests (
    id SERIAL,
    character_id int,
    content text,
    is_completed boolean,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);