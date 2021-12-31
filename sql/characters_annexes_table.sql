CREATE TABLE characters_annexes (
    id SERIAL,
    character_id int,
    content text,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);