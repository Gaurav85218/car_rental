<img width="1080" height="595" alt="{8B4DD57B-CC78-41C3-9562-BE2BE9F7275F}" src="https://github.com/user-attachments/assets/237b008e-42a6-4157-a6c3-fc9ec9b80446" />

# Car Rental Platform

A full-stack car rental application with separate portals for customers and hosts. Built with Spring Boot backend, React frontend, PostgreSQL database, and Cloudinary for image storage.

## Project Structure

```
car-rental-platform/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/carrental/
│   │   │   │   ├── CarRentalApplication.java
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                # React Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   └── host/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── DATABASE_SETUP.sql       # PostgreSQL setup script
└── README.md
```

## Screenshots
<img width="1079" height="601" alt="{9834B457-4755-47F2-8276-404CF2BEC6B7}" src="https://github.com/user-attachments/assets/cfbd780d-45b1-4895-8b68-364665c490fc" />
<img width="1080" height="599" alt="{CE2B03CA-55DE-4E56-B887-6D51A559AC58}" src="https://github.com/user-attachments/assets/51f8c81f-b74b-48f8-9045-b517274f6a57" />
<img width="1080" height="601" alt="{B07D572C-AA9A-42D9-A658-7B6AE899C3DA}" src="https://github.com/user-attachments/assets/cf0a92f6-e33d-4347-9769-fa3a9318ed4f" />
<img width="1080" height="601" alt="{4CB18A87-22B9-435F-9154-E0EF36CE7B15}" src="https://github.com/user-attachments/assets/535c67ab-caf3-4c6c-b3ba-37df54bc5ba5" />
<img width="1080" height="594" alt="{CB1D1AEE-A292-40AB-8ACC-2E3D2A0CEED2}" src="https://github.com/user-attachments/assets/7cf572a3-d3ca-4be9-895f-242fb5d8d7a5" />
<img width="1070" height="598" alt="{4A37B5C6-E94B-430B-9909-908117B34F1C}" src="https://github.com/user-attachments/assets/d49a144a-d916-4045-9cfa-b19920939b39" />
<img width="1080" height="599" alt="{FCFB4F07-D784-4A33-AF7E-76ECC50BE33D}" src="https://github.com/user-attachments/assets/0899c972-d878-46e3-8298-6ee49eeeb336" />


## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **Image Storage**: Cloudinary
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3

### Database
- **PostgreSQL**: Relational database for data persistence

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## Installation & Setup

### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the database setup script
\i DATABASE_SETUP.sql

# Or manually create the database
CREATE DATABASE car_rental;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Update application.properties with your database credentials
# File: src/main/resources/application.properties
# Update:
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password
# - jwt.secret (change to a secure value)
# - Cloudinary credentials (or use environment variables)

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Configuration

### Backend Configuration (application.properties)

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/car_rental
spring.datasource.username=postgres
spring.datasource.password=12345

# JWT
jwt.secret=your-super-secret-key-change-this-in-production
jwt.expiration=86400000

# Cloudinary
cloudinary.cloud-name=dg3cuao22
cloudinary.api-key=946122347991716
cloudinary.api-secret=phzFwknycQTC5nNzjNrkFIc

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Environment Variables (Recommended for Production)

```bash
# Backend
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
export JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cars (Customer)
- `GET /api/cars/browse` - Browse all available cars
- `GET /api/cars/{id}` - Get car details

### Cars (Host)
- `POST /api/cars/host/add` - Add new car (multipart/form-data)
- `GET /api/cars/host/my-cars` - Get host's cars
- `PUT /api/cars/host/{id}` - Update car (multipart/form-data)
- `DELETE /api/cars/host/{id}` - Delete car
- `DELETE /api/cars/host/{carId}/images` - Remove image from car

### Bookings (Customer)
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/my-bookings` - Get customer's bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Bookings (Host)
- `GET /api/bookings/host/bookings` - Get bookings for host's cars

## Features

### Customer Portal
- ✅ User registration and login
- ✅ Browse available cars
- ✅ View car details with images
- ✅ Book cars for specific dates
- ✅ View booking history
- ✅ Cancel bookings
- ✅ JWT-based authentication

### Host Portal
- ✅ User registration and login
- ✅ Add cars with up to 4 images
- ✅ Edit car details
- ✅ Delete cars
- ✅ Remove individual images
- ✅ View bookings for their cars
- ✅ JWT-based authentication

### Security
- ✅ JWT token-based authentication
- ✅ Role-based access control (CUSTOMER/HOST)
- ✅ Password encryption with BCrypt
- ✅ CORS enabled for frontend-backend communication
- ✅ Input validation on both frontend and backend

### Image Management
- ✅ Upload images to Cloudinary
- ✅ Maximum 4 images per car
- ✅ Automatic image optimization
- ✅ Secure URL storage in database

## Usage

### Customer Workflow
1. Register as a Customer
2. Login with credentials
3. Browse available cars
4. Click on a car to view details and images
5. Select dates and book the car
6. View bookings in "My Bookings"
7. Cancel bookings if needed

### Host Workflow
1. Register as a Host
2. Login with credentials
3. Add cars with details and images
4. Manage cars (edit/delete)
5. View bookings for your cars
6. Track rental activity

## Error Handling

The application includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication/Authorization errors
- Resource not found errors
- Business logic validation errors
- Global exception handler for unexpected errors

## Security Considerations

1. **JWT Secret**: Change the default JWT secret in production
2. **Cloudinary Credentials**: Use environment variables instead of hardcoding
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Configure CORS origins appropriately
5. **Password Policy**: Passwords require uppercase, lowercase, and digits
6. **Database**: Use strong passwords for database access

## Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Change port in application.properties
server.port=8081
```

**Database connection failed**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

**Cloudinary upload fails**
- Verify Cloudinary credentials
- Check API key and secret
- Ensure cloud name is correct

### Frontend Issues

**Port 5173 already in use**
```bash
npm run dev -- --port 5174
```

**API calls failing**
- Verify backend is running on port 8080
- Check CORS configuration
- Verify JWT token in localStorage

## Production Deployment

### Backend
1. Build JAR file: `mvn clean package`
2. Deploy to server (AWS, Heroku, DigitalOcean, etc.)
3. Set environment variables for sensitive data
4. Use HTTPS
5. Configure production database

### Frontend
1. Build: `npm run build`
2. Deploy to CDN or static hosting (Vercel, Netlify, AWS S3, etc.)
3. Update API base URL for production
4. Enable caching and compression

## Future Enhancements

- Payment integration (Stripe, PayPal)
- Email notifications
- User reviews and ratings
- Advanced search and filtering
- Real-time notifications
- Mobile app
- Admin dashboard
- Analytics and reporting

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

## Contributors

- Development Team

---

**Last Updated**: May 2026
