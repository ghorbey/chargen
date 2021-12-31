CREATE TABLE careers (
    id SERIAL,
    career_name varchar,
    vocation_id int,
    PRIMARY KEY(id),
    CONSTRAINT fk_vocation FOREIGN KEY(vocation_id) REFERENCES vocations(id)
);