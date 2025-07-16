# Moove - Premium Property Rental Platform

A comprehensive property rental platform built with React, TypeScript, and Spring Boot, designed specifically for the Sri Lankan market.

## 🚀 Features

### Core Features
- **Property Listings**: Browse and search properties with advanced filtering
- **User Authentication**: Separate roles for landlords and tenants
- **Booking System**: Complete booking request workflow with status tracking
- **Real-time Messaging**: In-app messaging between landlords and tenants
- **Location Services**: Sri Lankan district/town selection with Google Maps integration
- **Image Management**: Multiple image upload with drag-and-drop functionality

### Enhanced Features
- **Booking Dashboard**: Comprehensive dashboard for managing booking requests
- **Location System**: Cascading dropdowns for all 25 Sri Lankan districts
- **Google Maps Integration**: Interactive map for precise property location
- **Image Upload System**: Multiple image upload with preview and reordering
- **Real-time Notifications**: Instant alerts for booking requests and messages
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Maps JavaScript API** for location services
- **Axios** for API communication

### Backend
- **Spring Boot 3.5.3**
- **PostgreSQL** database
- **JPA/Hibernate** for ORM
- **Lombok** for boilerplate reduction

## 📋 Prerequisites

- Node.js 18+ and npm
- Java 17+
- PostgreSQL 12+
- Google Maps API key

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd moove-platform
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Google Maps API key to .env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory (if separate)
cd backend

# Update database configuration in src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/moove
spring.datasource.username=your-username
spring.datasource.password=your-password

# Run the application
./mvnw spring-boot:run
```

### 4. Database Setup
The application will automatically create the necessary tables on first run. Make sure PostgreSQL is running and the database exists.

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain
6. Add the API key to your `.env` file

## 📱 Key Components

### Location System
- **LocationSelector**: Cascading dropdowns for district/town selection
- **MapSelector**: Interactive Google Maps integration
- Supports all 25 Sri Lankan districts with major towns

### Booking System
- **BookingRequestModal**: Complete booking request form
- **BookingDashboardPage**: Manage all booking requests
- Status tracking: Pending → Accepted/Declined → Active/Expired

### Image Management
- **ImageUpload**: Drag-and-drop multiple image upload
- Image preview, reordering, and compression
- Main image selection functionality

### Messaging System
- Real-time messaging between users
- Message history and conversation threads
- Online/offline status indicators

## 🎨 UI/UX Features

### Design System
- Consistent color palette with primary/secondary themes
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-first approach

### User Experience
- Progressive form validation
- Loading states and error handling
- Toast notifications for user feedback
- Keyboard navigation support

## 📊 Database Schema

### Core Tables
- `users` - User authentication and profiles
- `properties` - Property listings with location data
- `booking_requests` - Booking request management
- `property_images` - Multiple images per property
- `messages` - Real-time messaging
- `notifications` - System notifications

### Location Tables
- `districts` - Sri Lankan districts
- `towns` - Towns/cities by district
- Property coordinates for map integration

## 🔧 Configuration

### Environment Variables
```bash
# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-api-key

# API Configuration
VITE_API_BASE_URL=http://localhost:8080/moove/api

# File Upload
VITE_MAX_FILE_SIZE=2097152  # 2MB
VITE_MAX_IMAGES_PER_PROPERTY=10

# Features
VITE_ENABLE_REAL_TIME_MESSAGING=true
VITE_ENABLE_LOCATION_SERVICES=true
```

### Backend Configuration
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/moove
spring.datasource.username=your-username
spring.datasource.password=your-password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# File Upload
spring.servlet.multipart.max-file-size=2MB
spring.servlet.multipart.max-request-size=20MB
```

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your hosting service
# The build files will be in the 'dist' directory
```

### Backend Deployment
```bash
# Create production JAR
./mvnw clean package

# Run the JAR file
java -jar target/moove-0.0.1-SNAPSHOT.jar
```

## 📈 Future Enhancements

### Planned Features
- [ ] Payment integration (Stripe/PayPal)
- [ ] Advanced property analytics
- [ ] Tenant background checks
- [ ] Automated lease agreements
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Property virtual tours
- [ ] AI-powered property recommendations

### Technical Improvements
- [ ] WebSocket for real-time features
- [ ] Redis caching
- [ ] Elasticsearch for advanced search
- [ ] CDN for image delivery
- [ ] Microservices architecture
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@moove.lk
- Documentation: [docs.moove.lk](https://docs.moove.lk)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Google Maps API for location services
- Pexels for stock property images
- Tailwind CSS for the design system
- React community for excellent libraries

---

**Moove** - Your trusted property rental platform for Sri Lanka 🏠