# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `/products` [GET]
- Show `/products/:id` [GET]
- Create [token required] `/products` [POST]
- [OPTIONAL] Top 5 most popular products `/products/top-5`
- [OPTIONAL] Products by category (args: product category) `/products/category/:category`

#### Users

- Index [token required] `/users` [GET]
- Show [token required] `/users/:id` [GET]
- Create N[token required] `/users/signup` [POST]
- Authenticate New [token required] `/users/login` [POST]

#### Orders

- Current Order by user (args: user id)[token required] `/orders/current-order` [GET]
- Change order status [token required] `/order/:id/complete` [PUT]
- Create [token required] `/orders` [POST]
- Current user's orders [token required] `/orders` [GET]
- Create order product [token required] `/orders/:order/products` [POST]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Tables

### Product

- id: serial primaryKey
- name: varchar
- price: int
- category: varchar

### User

- id: serial primaryKey
- firstName: varchar
- lastName: varchar
- password: varchar

### Orders

- id: serial primaryKey
- user_id: foreignKey
- status: varchar

### Order_Products

- id serial primaryKey
- quantity int
- order_id foreignKey
- product_id foreignKey
