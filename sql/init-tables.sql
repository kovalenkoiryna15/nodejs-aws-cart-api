create extension if not exists "uuid-ossp";

DROP TYPE IF EXISTS statuses; 
CREATE TYPE statuses AS ENUM ('OPEN', 'ORDERED'); 

create table carts (
  id uuid unique not null default uuid_generate_v4() primary key,
  user_id uuid not null,
  created_at date not null,
  updated_at date not null,
  status statuses
);

create table products (
	id uuid unique not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer not null
);

create table cart_items (
	cart_id uuid not null references carts(id),
	product_id uuid not null,
	count integer not null
);

DROP TYPE IF EXISTS order_statuses;
CREATE TYPE order_statuses AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

create table orders (
    id uuid unique not null default uuid_generate_v4() primary key,
    user_id uuid not null,
    cart_id uuid not null references carts(id),
    payment json,
    delivery json,
    items json,
    status_history json,
    comments text,
    status order_statuses,
    total integer
);

create table users (
  id uuid unique not null default uuid_generate_v4() primary key,
  name text unique not null,
  email text,
  password text not null
);

INSERT INTO users (id, name, email, password) VALUES 
  ('81f5a047-5db3-4649-a3a1-cfb469185e2c', 'kovalenkoiryna15', 'kovalenkoiryna15@gmail.com', 'TEST_PASSWORD'),
  ('277a20e5-5d1b-4d46-ab9a-d40378c015d8', 'testuser', 'testuser@gmail.com', 'TEST_PASSWORD');

INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES 
  ('a37de5ea-c8a1-4af6-8bb8-76e1b24ecaa4', '81f5a047-5db3-4649-a3a1-cfb469185e2c', '2023-12-21', '2023-12-21', 'ORDERED'),
  ('36a181bf-eab9-4906-b01f-f68a779ad4d2', '277a20e5-5d1b-4d46-ab9a-d40378c015d8', '2023-12-21', '2023-12-22', 'OPEN');
  
 INSERT INTO products (id, title, description, price) VALUES 
  ('740c1845-c0f4-4587-87dd-78be1804f3b1', 'Brazylia Santa Clara', 'The seeds come from natural processing, which suggests a high body and a specific dose of sweetness.', 20),
  ('61f30d6b-f1a2-4e8b-8158-d2e4987bf3b1', 'Drip Coffee Blend', 'Drip Coffee Blend is a mix of the highest quality beans from different parts of the world. ', 11),
  ('9670f8fe-ae3e-4286-990b-375a66bc7b95', 'Decaf Colombia Cauca Espresso', 'The beans of this coffee are a carefully selected blend of Arabica beans from the Colombian Cauca region. ', 12),
  ('bbb02a04-0f70-4075-872f-be580a0d0514', 'Burundi Mikuba', 'Bourbon variety, used from crops from the picturesque Mikuba hill in the Kayanza location.', 14),
  ('0d36c5e2-3bea-4ab3-bfc9-c66142fa0689', 'Ethiopia Yirga Beloya', 'More beans from Ethiopia - another temptation for the senses...', 15),
  ('dce6f5c8-092c-408b-bcbc-fd3c10dd211e', 'Costa Rica Las Lajas', 'Meet our latest filter COSTA RICA coffee from the Las Lajas farm, which comes from a semi-washed process, which is an intermediate method between washed and natural processing.', 16);
  
INSERT INTO cart_items (cart_id, product_id, count) VALUES 
  ('a37de5ea-c8a1-4af6-8bb8-76e1b24ecaa4', '740c1845-c0f4-4587-87dd-78be1804f3b1', 1),
  ('a37de5ea-c8a1-4af6-8bb8-76e1b24ecaa4', '61f30d6b-f1a2-4e8b-8158-d2e4987bf3b1', 1),
  ('36a181bf-eab9-4906-b01f-f68a779ad4d2', '0d36c5e2-3bea-4ab3-bfc9-c66142fa0689', 1),
  ('36a181bf-eab9-4906-b01f-f68a779ad4d2', 'dce6f5c8-092c-408b-bcbc-fd3c10dd211e', 3);

