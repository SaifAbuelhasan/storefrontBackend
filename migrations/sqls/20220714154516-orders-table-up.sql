-- create orders table
CREATE TABLE orders (
    id serial PRIMARY KEY,
    user_id int NOT NULL,
    status varchar(100) CHECK (status IN ('active', 'completed'))
);