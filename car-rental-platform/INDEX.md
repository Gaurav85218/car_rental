# Car Rental Platform - Complete Index

## 📚 Documentation Files

### Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
- **[README.md](README.md)** - Complete project documentation
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and deliverables

### Configuration & Setup
- **[CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)** - Cloudinary image storage setup
- **[DATABASE_SETUP.sql](DATABASE_SETUP.sql)** - PostgreSQL database initialization
- **[.env.example](backend/.env.example)** - Backend environment variables template
- **[.env.example](frontend/.env.example)** - Frontend environment variables template

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

---

## 🏗️ Backend Structure

### Main Application
```
backend/
├── src/main/java/com/carrental/
│   ├── CarRentalApplication.java          # Main Spring Boot app
│   ├── config/
│   │   ├── CloudinaryConfig.java          # Cloudinary configuration
│   │   └── SecurityConfig.java            # JWT & Spring Security config
│   ├── controller/
│   │   ├── AuthController.java            # Authentication endpoints
│   │   ├── CarController.java             # Car management endpoints
│   │   └── BookingController.java         # Booking endpoints
│   ├── dto/
│   │   ├── AuthRequest.java               # Login request
│   │   ├── AuthResponse.java              # Login response
│   │   ├── RegisterRequest.java           # Registration request
│   │   ├── CarRequest.java                # Car creation request
│   │   ├── CarResponse.java               # Car response
│   │   ├── BookingRequest.java            # Booking creation request
│   │   └── BookingResponse.java           # Booking response
│   ├── entity/
│   │   ├── User.java                      # User entity
│   │   ├── UserRole.java                  # User role enum
│   │   ├── Car.java                       # Car entity
│   │   ├── Booking.java                   # Booking entity
│   │   └── BookingStatus.java             # Booking status enum
│   ├── exception/
│   │   └── GlobalExceptionHandler.java    # Global error handling
│   ├── repository/
│   │   ├── UserRepository.java            # User data access
│   │   ├── CarRepository.java             # Car data access
│   │   └── BookingRepository.java         # Booking data access
│   ├── security/
│   │   ├── JwtUtil.java                   # JWT token utilities
│   │   └── JwtAuthenticationFilter.java   # JWT filter
│   └── service/
│       ├── AuthService.java               # Authentication logic
│       ├── CarService.java                # Car management logic
│       ├── BookingService.java            # Booking logic
│       ├── CloudinaryService.java         # Image upload logic
│       └── CustomUserDetailsService.java  # User details service
├── src/main/resources/
│   └── application.properties              # Application configuration
└── pom.xml                                 # Maven dependencies
```

### Key Features
- ✅ Spring Boot 3.2.0 with Java 17
- ✅ JWT authentication with Spring Security
- ✅ PostgreSQL with JPA/Hibernate
- ✅ Cloudinary image integration
- ✅ RESTful API design
- ✅ Global exception handling
- ✅ CORS configuration

---

## 🎨 Frontend Structure

### Main Application
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                     # Navigation bar
│   │   ├── Navbar.css                     # Navbar styles
│   │   └── PrivateRoute.jsx               # Protected routes
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx                  # Login page
│   │   │   ├── Register.jsx               # Registration page
│   │   │   └── Auth.css                   # Auth styles
│   │   ├── customer/
│   │   │   ├── Dashboard.jsx              # Customer dashboard
│   │   │   ├── BrowseCars.jsx             # Browse cars page
│   │   │   ├── CarDetails.jsx             # Car details & booking
│   │   │   ├── BookingHistory.jsx         # Booking history
│   │   │   └── Customer.css               # Customer styles
│   │   └── host/
│   │       ├── Dashboard.jsx              # Host dashboard
│   │       ├── AddCar.jsx                 # Add car page
│   │       ├── ManageCars.jsx             # Manage cars page
│   │       ├── EditCar.jsx                # Edit car page
│   │       ├── Bookings.jsx               # View bookings
│   │       └── Host.css                   # Host styles
│   ├── services/
│   │   └── api.js                         # API client with Axios
│   ├── App.jsx                            # Main app component
│   ├── App.css                            # Global styles
│   └── main.jsx                           # React entry point
├── index.html                             # HTML template
├── package.json                           # Dependencies
└── vite.config.js                         # Vite configuration
```

### Key Features
- ✅ React 18.2.0 with Vite
- ✅ React Router v6 for navigation
- ✅ Axios with JWT interceptors
- ✅ Responsive CSS design
- ✅ Role-based access control
- ✅ Form validation
- ✅ Image upload support

---

## 🗄️ Database Schema

### Tables
1. **users** - User accounts (customers and hosts)
2. **cars** - Car listings
3. **car_images** - Car images (up to 4 per car)
4. **bookings** - Car rental bookings

### Relationships
- User → Cars (1:N) - Host has many cars
- User → Bookings (1:N) - Customer has many bookings
- Car → Bookings (1:N) - Car has many bookings
- Car → Images (1:N) - Car has many images

---

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
```

### Cars (Public)
```
GET    /api/cars/browse            Browse all cars
GET    /api/cars/{id}              Get car details
```

### Cars (Host Only)
```
POST   /api/cars/host/add          Add new car
GET    /api/cars/host/my-cars      Get host's cars
PUT    /api/cars/host/{id}         Update car
DELETE /api/cars/host/{id}         Delete car
DELETE /api/cars/host/{carId}/images  Remove image
```

### Bookings (Customer)
```
POST   /api/bookings/create        Create booking
GET    /api/bookings/my-bookings   Get customer's bookings
GET    /api/bookings/{id}          Get booking details
PUT    /api/bookings/{id}/cancel   Cancel booking
```

### Bookings (Host)
```
GET    /api/bookings/host/bookings Get host's bookings
```

---

## 🚀 Quick Commands

### Backend
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Package
mvn clean package
```

### Frontend
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Database
```bash
# Setup
psql -U postgres -d car_rental -f DATABASE_SETUP.sql

# Backup
pg_dump -U postgres car_rental > backup.sql

# Restore
psql -U postgres car_rental < backup.sql
```

---

## 📋 Checklist for Deployment

### Pre-Deployment
- [ ] Update JWT secret in application.properties
- [ ] Configure Cloudinary credentials
- [ ] Set up PostgreSQL database
- [ ] Update CORS origins
- [ ] Test all features locally
- [ ] Review security settings

### Backend Deployment
- [ ] Build JAR file
- [ ] Set environment variables
- [ ] Configure database connection
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Configure backups

### Frontend Deployment
- [ ] Build production bundle
- [ ] Update API base URL
- [ ] Enable caching
- [ ] Optimize images
- [ ] Test on production
- [ ] Set up CDN

---

## 🔧 Configuration Files

### Backend Configuration
- `application.properties` - Main configuration
- `pom.xml` - Maven dependencies
- `.env.example` - Environment variables template

### Frontend Configuration
- `vite.config.js` - Vite build configuration
- `package.json` - NPM dependencies
- `.env.example` - Environment variables template

---

## 📚 Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- PostgreSQL
- Cloudinary SDK
- JWT (JJWT)
- Maven

### Frontend
- React 18.2.0
- Vite 5.0.0
- React Router 6.20.0
- Axios 1.6.0
- CSS3

### Database
- PostgreSQL 12+

### Cloud Services
- Cloudinary (Image Storage)

---

## 🎯 Feature Checklist

### Authentication
- [x] User registration
- [x] User login
- [x] JWT token generation
- [x] Token validation
- [x] Role-based access control
- [x] Password encryption

### Customer Features
- [x] Browse cars
- [x] View car details
- [x] Book cars
- [x] View bookings
- [x] Cancel bookings
- [x] Calculate rental price

### Host Features
- [x] Add cars
- [x] Upload images
- [x] Edit cars
- [x] Delete cars
- [x] Remove images
- [x] View bookings

### Technical Features
- [x] CORS enabled
- [x] Input validation
- [x] Error handling
- [x] Logging
- [x] Responsive design
- [x] Image optimization

---

## 📖 Documentation Guide

1. **Start Here**: [QUICKSTART.md](QUICKSTART.md)
2. **Learn More**: [README.md](README.md)
3. **Setup Images**: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)
4. **Deploy**: [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Project Details**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 🆘 Troubleshooting

### Common Issues
- Backend won't start → Check port 8080
- Database connection failed → Verify PostgreSQL
- Images not uploading → Check Cloudinary credentials
- Frontend won't load → Verify API base URL
- CORS errors → Check CORS configuration

See [README.md](README.md) for detailed troubleshooting.

---

## 📞 Support

For issues or questions:
1. Check the relevant documentation file
2. Review the troubleshooting section
3. Check application logs
4. Create an issue in the repository

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🎉 Summary

This is a complete, production-ready car rental platform with:
- Full backend implementation
- Complete frontend application
- PostgreSQL database
- Cloudinary integration
- JWT authentication
- Comprehensive documentation
- Deployment guides

**Ready to deploy and extend!**

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
