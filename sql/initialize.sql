DROP TABLE IF EXISTS characters_annexes;
DROP TABLE IF EXISTS characters_careers;
DROP TABLE IF EXISTS characters_chapters;
DROP TABLE IF EXISTS characters_personal_quests;
DROP TABLE IF EXISTS characters_skills;
DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS careers_skills;
DROP TABLE IF EXISTS careers;
DROP TABLE IF EXISTS vocations;
DROP TABLE IF EXISTS races_skills;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS religions;
DROP TABLE IF EXISTS countries;

CREATE TABLE vocations (
    id SERIAL,
    vocation_name varchar NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE users (
    id SERIAL,
    user_firstname varchar NOT NULL,
    user_lastname varchar,
    phone_number varchar DEFAULT '',
    email varchar NOT NULL,
    user_password varchar NOT NULL,
    is_admin boolean DEFAULT false,
    PRIMARY KEY(id)
);

CREATE TABLE skills (
    id SERIAL,
    skill_name varchar NOT NULL,
    is_base boolean DEFAULT false,
    is_racial_only boolean DEFAULT false,
    prerequisite_skill_id int DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE religions (
    id SERIAL,
    religion_name varchar NOT NULL,
    race_id int DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE races (
    id SERIAL,
    race_name varchar NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE countries (
    id SERIAL,
    country_name varchar NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE careers (
    id SERIAL,
    career_name varchar NOT NULL,
    vocation_id int NOT NULL,
    is_advanced boolean DEFAULT false,
    PRIMARY KEY(id),
    CONSTRAINT fk_vocation FOREIGN KEY(vocation_id) REFERENCES vocations(id)
);

CREATE TABLE careers_skills (
    career_id int NOT NULL,
    skill_id int NOT NULL,
    PRIMARY KEY(career_id, skill_id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE races_skills (
    race_id int NOT NULL,
    skill_id int NOT NULL,
    PRIMARY KEY(race_id, skill_id),
    CONSTRAINT fk_race FOREIGN KEY(race_id) REFERENCES races(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE characters (
    id SERIAL,
    user_id int NOT NULL,
    character_name varchar DEFAULT '' NOT NULL,
    character_type varchar DEFAULT 'pj' NOT NULL,
    character_number int DEFAULT '000' NOT NULL,
    fate_points int DEFAULT 2,
    country_id int DEFAULT 1 NOT NULL,
    race_id int DEFAULT 1 NOT NULL,
    religion_id int DEFAULT 1 NOT NULL,
    vocation_id int DEFAULT 1 NOT NULL,
    current_xp int DEFAULT 0 NOT NULL,
    total_xp int DEFAULT 0 NOT NULL,
    public_legend text DEFAULT '',
    background text DEFAULT '',
    career_plan text DEFAULT '',
    PRIMARY KEY(id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_country FOREIGN KEY(country_id) REFERENCES countries(id),
    CONSTRAINT fk_race FOREIGN KEY(race_id) REFERENCES races(id),
    CONSTRAINT fk_religion FOREIGN KEY(religion_id) REFERENCES religions(id),
    CONSTRAINT fk_vocation FOREIGN KEY(vocation_id) REFERENCES vocations(id)
);

CREATE TABLE characters_skills (
    id SERIAL,
    character_id int NOT NULL,
    skill_id int NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_skill FOREIGN KEY(skill_id) REFERENCES skills(id)
);

CREATE TABLE characters_personal_quests (
    id SERIAL,
    character_id int NOT NULL,
    content text DEFAULT '',
    is_completed boolean DEFAULT false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);

CREATE TABLE characters_chapters (
    id SERIAL,
    character_id int NOT NULL,
    content text DEFAULT '',
    sortOrder int,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);

CREATE TABLE characters_careers (
    id SERIAL,
    character_id int NOT NULL,
    career_id int NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id),
    CONSTRAINT fk_career FOREIGN KEY(career_id) REFERENCES careers(id)
);

CREATE TABLE characters_annexes (
    id SERIAL,
    character_id int NOT NULL,
    content text DEFAULT '',
    PRIMARY KEY(id),
    CONSTRAINT fk_character FOREIGN KEY(character_id) REFERENCES characters(id)
);

INSERT INTO users (user_firstname, user_lastname, phone_number, email, user_password, is_admin) VALUES ('Stéphane', 'Paquay', '0495/77.90.18', 's.paquay@gmail.com', '5b1239604f38b2f55640c18c31690e517e16272a384f662b236722040a01d448', true);
INSERT INTO users (user_firstname, user_lastname, phone_number, email, user_password, is_admin) VALUES ('Frédéric', 'Pire', '0484/24.41.20', 'wodin666@hotmail.com', '21a5cb47367e9cbfaea510818bff43d08da70befd3e54638be290d831b2bc5db', true); /*gnfred*/
INSERT INTO users (user_firstname, user_lastname, phone_number, email, user_password, is_admin) VALUES ('test', 'test', '000', 'test@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', false); /*test*/

INSERT INTO vocations (vocation_name) VALUES ('Guerrier');
INSERT INTO vocations (vocation_name) VALUES ('Rôdeur');
INSERT INTO vocations (vocation_name) VALUES ('Citadin');
INSERT INTO vocations (vocation_name) VALUES ('Lettré');

INSERT INTO religions (religion_name, race_id) VALUES ('Tous', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Manann', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Mórr', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Myrmidia', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Ranald', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Shallya', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Taal', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Rhya', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Ulric', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Verena', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Haendryk', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Aucun', 0);
INSERT INTO religions (religion_name, race_id) VALUES ('Asuryan', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Hoeth', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Isha', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Kurnous', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Lileath (La vierge)', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Loec', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Mathlann', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Morai-Heg', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Vaul', 2);
INSERT INTO religions (religion_name, race_id) VALUES ('Esméralda', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Josias', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Hyacinthe', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Phinéas', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Gaffey', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Quinsberry', 3);
INSERT INTO religions (religion_name, race_id) VALUES ('Grungni', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Valaya', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Grimmir', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Gazul', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Smednir', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Thungni', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Krignar', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Thorin', 4);
INSERT INTO religions (religion_name, race_id) VALUES ('Autre', 0);

INSERT INTO races (race_name) VALUES ('Humain');
INSERT INTO races (race_name) VALUES ('Elfe');
INSERT INTO races (race_name) VALUES ('Nain');
INSERT INTO races (race_name) VALUES ('Halflings');

INSERT INTO countries (country_name) VALUES ('Principautés frontalières');
INSERT INTO countries (country_name) VALUES ('Empire');
INSERT INTO countries (country_name) VALUES ('Bretonie');
INSERT INTO countries (country_name) VALUES ('Estalie');
INSERT INTO countries (country_name) VALUES ('Kislev');
INSERT INTO countries (country_name) VALUES ('Norsca');
INSERT INTO countries (country_name) VALUES ('Tilée');
INSERT INTO countries (country_name) VALUES ('Terres désolés');
INSERT INTO countries (country_name) VALUES ('Désolations du chaos');

INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Armes de base', true, false); /* 1 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Fouille', true, false); /* 2 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Armure de base', true, false); /* 3 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Lire/Écrire (Commun)', true, false); /* 4 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Richesse', true, false); /* 5 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Rumeurs', true, false); /* 6 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Arcs/Arbalètes', false, false); /* 7 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Lire/Écrire (Eltharin)', false, true, 4); /* 8 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Psychologie Elfe', false, true); /* 9 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Endurant I', false, false); /* 10 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Lire/Écrire (Khazalid)', false, true, 4); /* 11 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Psychologie Naine', false, true); /* 12 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Résistance aux poisons', false, false); /* 13 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Lire/Écrire (Alf)', false, true, 4); /* 14 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Psychologie Halfling', false, true); /* 15 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Ambidextrie', false, false); /* 16 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Armes bâtardes', false, false, 20); /* 17 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Armes de lancer', false, false); /* 18 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Armes d''hast', false, false); /* 19 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Armes à 1 main', false, false); /* 20 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Armes à 2 mains', false, false, 20); /* 21 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Armure I', false, false, 3); /* 22 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Armure II', false, false, 22); /* 23 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Armure III', false, false, 23); /* 24 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Bouclier léger', false, false, 3); /* 25 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Bouclier lourd', false, false, 25); /* 26 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Bûcheronnage I', false, false); /* 27 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Bûcheronnage II', false, false, 27); /* 28 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Bûcheronnage III', false, false, 28); /* 29 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Camouflage rural', false, false); /* 30 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Camouflage urbain', false, false); /* 31 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Charge', false, false, 20); /* 32 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Chasse I', false, false); /* 33 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Chasse II', false, false, 33); /* 34 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Chasse III', false, false, 34); /* 35 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Coup assommant', false, false); /* 36 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Coup fauchant', false, false, 20); /* 37 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Coup puissant', false, false, 20); /* 38 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Cueillette I', false, false); /* 39 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Cueillette II', false, false, 39); /* 40 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Cueillette III', false, false, 40); /* 41 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Désarmement', false, false, 20); /* 42 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Endurant II', false, false, 10); /* 43 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Endurant III', false, false, 43); /* 44 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Esquive', false, false); /* 45 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Excavation I', false, false); /* 46 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Excavation II', false, false, 46); /* 47 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Excavation III', false, false, 47); /* 48 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Expression artistique (Thérapeutique)', false, false); /* 49 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Expression artistique (Gastronomique)', false, false); /* 50 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Expression artistique (Ouvrage)', false, false); /* 51 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Focalisation', false, false, 4); /* 52 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Fonderie', false, false); /* 53 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Forgeage I', false, false); /* 54 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Forgeage II', false, false, 54); /* 55 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Forgeage III', false, false, 55); /* 56 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Fouille (Avancé)', false, false, 2); /* 57 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Identification', false, false, 4); /* 58 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Identification (Avancé)', false, false, 58); /* 59 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Lire/écrire (Magick)', false, false, 4); /* 60 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Divine) I', false, false, 52); /* 61 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Divine) II', false, false, 61); /* 62 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Divine) III', false, false, 62); /* 63 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Occulte) I', false, false, 52); /* 64 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Occulte) II', false, false, 64); /* 65 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Magie commune (Occulte) III', false, false, 65); /* 66 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Menuiserie', false, false); /* 67 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Poche secrète', false, false); /* 68 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Préparation de potions et poisons', false, false, 4); /* 69 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Préparation de potions et poisons (Avancé)', false, false, 69); /* 70 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Préparation de baumes et cataplasmes', false, false, 4); /* 71 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Préparation de baumes et cataplasmes (Avancé)', false, false, 71); /* 72 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Raffinage', false, false); /* 73 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Ressources', false, false); /* 74 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Résistance aux maladies', false, false); /* 75 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Richesse (Avancé)', false, false, 5); /* 76 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Soins I', false, false, 80); /* 77 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Soins II', false, false, 77); /* 78 */
INSERT INTO skills (skill_name, is_base, is_racial_only, prerequisite_skill_id) VALUES ('Soins III', false, false, 78); /* 79 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Stabilisation', false, false); /* 80 */
INSERT INTO skills (skill_name, is_base, is_racial_only) VALUES ('Tannage', false, false); /* 81 */

INSERT INTO races_skills (race_id, skill_id) VALUES (1, 1);
INSERT INTO races_skills (race_id, skill_id) VALUES (2, 7);
INSERT INTO races_skills (race_id, skill_id) VALUES (2, 8);
INSERT INTO races_skills (race_id, skill_id) VALUES (2, 9);
INSERT INTO races_skills (race_id, skill_id) VALUES (3, 10);
INSERT INTO races_skills (race_id, skill_id) VALUES (3, 11);
INSERT INTO races_skills (race_id, skill_id) VALUES (3, 12);
INSERT INTO races_skills (race_id, skill_id) VALUES (4, 13);
INSERT INTO races_skills (race_id, skill_id) VALUES (4, 14);
INSERT INTO races_skills (race_id, skill_id) VALUES (4, 15);

-- Lettrés
INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Apprenti sorcier', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 64);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 65);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 66);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 74);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 60);
INSERT INTO careers_skills (career_id, skill_id) VALUES (1, 52);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Chirurgien barbier', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 77);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 78);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 79);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 80);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 75);
INSERT INTO careers_skills (career_id, skill_id) VALUES (2, 36);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Étudiant', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 80);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 13);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 4);
INSERT INTO careers_skills (career_id, skill_id) VALUES (3, 58);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Initié', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 61);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 62);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 63);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 74);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 52);
INSERT INTO careers_skills (career_id, skill_id) VALUES (4, 20);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Scribe', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 4);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 8);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 11);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 14);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 60);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 80);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 74);
INSERT INTO careers_skills (career_id, skill_id) VALUES (5, 58);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Ménestrel', 4, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 49);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 50);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 51);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 8);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 11);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 14);
INSERT INTO careers_skills (career_id, skill_id) VALUES (6, 45);

-- Citadins
INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Artisan (Fondeur, Menuisier, Tanneur, Raffineur)', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 53);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 67);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 81);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 73);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (7, 20);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Forgeron', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 54);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 55);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 56);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (8, 43);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Herboriste', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 69);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 70);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 71);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 72);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 13);
INSERT INTO careers_skills (career_id, skill_id) VALUES (9, 18);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Marchand', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 58);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 59);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 74);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 4);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 68);
INSERT INTO careers_skills (career_id, skill_id) VALUES (10, 76);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Voleur', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 57);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 16);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 18);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 31);
INSERT INTO careers_skills (career_id, skill_id) VALUES (11, 30);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Serviteur', 3, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 13);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 31);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 36);
INSERT INTO careers_skills (career_id, skill_id) VALUES (12, 75);

-- Rôdeurs
INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Bûcheron', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 21);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 27);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 28);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 29);
INSERT INTO careers_skills (career_id, skill_id) VALUES (13, 10);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Chasseur', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 18);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 7);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 33);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 34);
INSERT INTO careers_skills (career_id, skill_id) VALUES (14, 35);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Éclaireur', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 30);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 37);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 22);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (15, 18);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Mineur', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 43);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 46);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 47);
INSERT INTO careers_skills (career_id, skill_id) VALUES (16, 48);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Vagabond', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 17);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 39);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 40);
INSERT INTO careers_skills (career_id, skill_id) VALUES (17, 41);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Chasseur de primes', 2, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 19);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 22);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 23);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 36);
INSERT INTO careers_skills (career_id, skill_id) VALUES (18, 37);

-- Guerriers
INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Duelliste', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 37);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 38);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 45);
INSERT INTO careers_skills (career_id, skill_id) VALUES (19, 16);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Écuyer', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 17);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 19);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 22);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (20, 32);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Hors-la-loi', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 18);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 43);
INSERT INTO careers_skills (career_id, skill_id) VALUES (21, 44);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Mercenaire', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 22);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 23);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 24);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (22, 21);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Milicien', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 38);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 26);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 10);
INSERT INTO careers_skills (career_id, skill_id) VALUES (23, 22);

INSERT INTO careers (career_name, vocation_id, is_advanced) VALUES ('Franc-archer', 1, false);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 7);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 18);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 20);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 22);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 25);
INSERT INTO careers_skills (career_id, skill_id) VALUES (24, 10);