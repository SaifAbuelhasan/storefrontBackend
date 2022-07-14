-- create order_products table
CREATE TABLE order_products (
    id serial PRIMARY KEY,
    order_id int REFERENCES orders(id),
    product_id int REFERENCES products(id),
    quantity int NOT NULL
);