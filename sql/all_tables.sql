CREATE TABLE vocations (
    id SERIAL,
    vocation_name int,
    PRIMARY KEY(id)
);

CREATE TABLE users (
    id SERIAL,
    user_firstname varchar,
    user_lastname varchar,
    phone_number varchar,
    email varchar,
    user_password varchar,
    is_admin boolean,
    PRIMARY KEY(id)
);

CREATE TABLE skills(
    id SERIAL,
    skill_name varchar,
    PRIMARY KEY(id)
);

CREATE TABLE religions (
    id SERIAL,
    religion_name varchar,
    PRIMARY KEY(id)
);

CREATE TABLE races (
    id SERIAL,
    race_name varchar,
    PRIMARY KEY(id)
);

CREATE TABLE countries (
    id SERIAL,
    country_name varchar,
    PRIMARY KEY(id)
);

CREATE TABLE careers (
    id SERIAL,
    career_name varchar,
    vocation_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_vocation FOREIGN KEY(vocation_id) REFERENCES vocations(id)
);

CREATE TABLE careers_skills (
    id SERIAL,
    career_id int,
    skill_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE characters (
    id SERIAL,
    user_id int,
    character_name varchar,
    character_type varchar,
    character_number int,
    fate_points int,
    country_id int,
    race_id int,
    religion_id int,
    vocation_id int,
    current_xp int,
    total_xp int,
    public_legend text,
    background text,
    PRIMARY KEY(id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_country FOREIGN KEY(country_id) REFERENCES countries(id),
    CONSTRAINT fk_race FOREIGN KEY(race_id) REFERENCES races(id),
    CONSTRAINT fk_religion FOREIGN KEY(religion_id) REFERENCES religions(id),
    CONSTRAINT fk_vocation FOREIGN KEY(vocation_id) REFERENCES vocations(id)
);

CREATE TABLE characters_skills (
    id SERIAL,
    character_id int,
    skill_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE characters_personal_quests (
    id SERIAL,
    character_id int,
    content text,
    is_completed boolean,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);

CREATE TABLE characters_chapters (
    id SERIAL,
    character_id int,
    content text,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);

CREATE TABLE characters_careers (
    id SERIAL,
    character_id int,
    career_id int,
    is_current boolean,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id)
);

CREATE TABLE characters_annexes (
    id SERIAL,
    character_id int,
    content text,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);