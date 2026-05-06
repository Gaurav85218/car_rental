-- Create database
CREATE DATABASE car_rental;

-- Connect to the database
\c car_rental;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    license_number VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    created_at BIGINT NOT NULL,
    CONSTRAINT check_role CHECK (role IN ('CUSTOMER', 'HOST'))
);

-- Create cars table
CREATE TABLE cars (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    price_per_day DOUBLE PRECISION NOT NULL,
    host_id BIGINT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create car_images table
CREATE TABLE car_images (
    car_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    car_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    created_at BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    CONSTRAINT check_status CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'))
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cars_host_id ON cars(host_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_status ON bookings(status);
