-- create products table
CREATE TABLE products (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  price numeric NOT NULL,
  category varchar(100)
);