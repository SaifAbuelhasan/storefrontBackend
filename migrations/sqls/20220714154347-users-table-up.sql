-- create users table
CREATE TABLE users (
  id serial PRIMARY KEY,
  firstName varchar(100) NOT NULL,
  lastName varchar(100) NOT NULL,
  password varchar(100) NOT NULL
);