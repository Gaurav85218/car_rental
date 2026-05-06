# Running the Car Rental Platform

## Prerequisites

Before running the application, ensure you have:

1. **Java 17+** installed
   ```bash
   java -version
   ```

2. **Maven 3.6+** installed
   ```bash
   mvn -version
   ```

3. **Node.js 16+** installed
   ```bash
   node -version
   npm -version
   ```

4. **PostgreSQL 12+** installed and running
   ```bash
   psql --version
   ```

## Step 1: Setup Database

First, create and initialize the PostgreSQL database:

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

Or use the SQL file directly:
```bash
psql -U postgres -d car_rental < DATABASE_SETUP.sql
```

## Step 2: Start Backend (Spring Boot)

Open a terminal and run:

```bash
cd car-rental-platform/backend
mvn clean install
mvn spring-boot:run
```

**Expected Output:**
```
Started CarRentalApplication in X.XXX seconds
```

**Backend URL:** http://localhost:8080/api

## Step 3: Start Frontend (React + Vite)

Open a new terminal and run:

```bash
cd car-rental-platform/frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

**Frontend URL:** http://localhost:5173

## Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the login page

## Testing the Application

### Create a Customer Account

1. Click "Register"
2. Fill in the form:
   - Username: `customer1`
   - Email: `customer@example.com`
   - Password: `TestPass123`
   - Phone: `555-1234`
   - Address: `123 Main St`
   - License Number: `DL123456`
   - Role: **Customer**
3. Click "Register"

### Create a Host Account

1. Click "Register"
2. Fill in the form:
   - Username: `host1`
   - Email: `host@example.com`
   - Password: `TestPass123`
   - Phone: `555-5678`
   - Address: `456 Oak Ave`
   - License Number: `DL789012`
   - Role: **Host**
3. Click "Register"

### Test Customer Features

1. Login as customer
2. Go to "Browse Cars"
3. Click on a car to view details
4. Book a car for specific dates

### Test Host Features

1. Login as host
2. Go to "Add Car"
3. Fill in car details:
   - Model: `Toyota Camry`
   - Age: `2`
   - Price per Day: `50`
4. Upload images (optional)
5. Click "Add Car"
6. Go to "Manage Cars" to see your cars
7. Go to "Bookings" to see customer bookings

## Troubleshooting

### Backend Issues

**Maven not found:**
```bash
# Install Maven or add to PATH
# Or use: ./mvnw spring-boot:run (if using Maven wrapper)
```

**Port 8080 already in use:**
```bash
# Change port in: backend/src/main/resources/application.properties
server.port=8081
```

**Database connection error:**
```bash
# Verify PostgreSQL is running
# Check credentials in application.properties
# Ensure database exists
```

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**npm install fails:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

**API calls failing:**
```bash
# Verify backend is running on port 8080
# Check CORS configuration
# Check browser console for errors
```

## Stopping the Application

### Stop Backend
- Press `Ctrl+C` in the backend terminal

### Stop Frontend
- Press `Ctrl+C` in the frontend terminal

## Production Build

### Build Backend
```bash
cd backend
mvn clean package
java -jar target/car-rental-backend-1.0.0.jar
```

### Build Frontend
```bash
cd frontend
npm run build
# Output will be in dist/ folder
```

## Environment Variables

### Backend (Optional)
Create a `.env` file in the backend directory:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

### Frontend (Optional)
Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Next Steps

1. **Explore the UI** - Test all features
2. **Review Code** - Check backend and frontend code
3. **Read Documentation** - See README.md and other docs
4. **Deploy** - Follow DEPLOYMENT.md for production

## Support

For issues:
1. Check the troubleshooting section above
2. Review application logs
3. Check browser console (F12)
4. See README.md for more help

---

**Happy coding!** 🚗
