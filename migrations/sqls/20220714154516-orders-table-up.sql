-- create orders table
CREATE TABLE orders (
    id serial PRIMARY KEY,
    user_id int REFERENCES users ON DELETE CASCADE,
    status varchar(100) CHECK (status IN ('active', 'completed'))
);