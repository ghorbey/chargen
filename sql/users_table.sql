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