# Quick Start Guide

Get the Car Rental Platform up and running in 5 minutes!

## Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+

## Step 1: Database Setup (2 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE car_rental;

# Exit psql
\q

# Run setup script
psql -U postgres -d car_rental -f DATABASE_SETUP.sql
```

## Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
mvn clean install

# Start the backend
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080/api`

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Step 4: Test the Application

### Create a Customer Account
1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill in the form and select "Customer" as role
4. Click "Register"

### Create a Host Account
1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill in the form and select "Host" as role
4. Click "Register"

### Test Customer Features
1. Login as customer
2. Go to "Browse Cars"
3. Click on a car to view details
4. Book a car for specific dates

### Test Host Features
1. Login as host
2. Go to "Add Car"
3. Fill in car details and upload images
4. Go to "Manage Cars" to edit/delete
5. Go to "Bookings" to view customer bookings

## Default Credentials (for testing)

After running the setup, you can create test accounts through the registration page.

## Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
# Change port in: backend/src/main/resources/application.properties
server.port=8081
```

### Database connection error
```bash
# Verify PostgreSQL is running
# Check credentials in application.properties
# Ensure database exists: psql -U postgres -l
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Images not uploading
- Verify Cloudinary credentials in application.properties
- Check API key and secret are correct
- Ensure cloud name matches your Cloudinary account

## API Testing

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'
```

### Browse Cars
```bash
curl http://localhost:8080/api/cars/browse
```

### Get Car Details
```bash
curl http://localhost:8080/api/cars/1
```

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Explore the API endpoints
3. Customize the UI and styling
4. Add more features as needed
5. Deploy to production

## Support

For issues, check the main README.md or create an issue in the repository.

---

**Happy coding!** 🚗
