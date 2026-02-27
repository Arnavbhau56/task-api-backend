# Task Management API - Production-Ready Full-Stack Application

A scalable REST API with JWT authentication, role-based access control (RBAC), and a React frontend.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (access + refresh tokens with rotation)
- **Caching**: Redis
- **Logging**: Winston
- **Documentation**: Swagger (OpenAPI 3.0)
- **Security**: Helmet, express-rate-limit, bcrypt (12 salt rounds)
- **Validation**: express-validator

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify

### DevOps
- **Containerization**: Docker + docker-compose
- **Testing**: Jest + Supertest

---

## 📋 Features

### Authentication System
- ✅ User registration with bcrypt password hashing
- ✅ JWT-based authentication (access token: 15min, refresh token: 7d)
- ✅ Refresh token rotation for enhanced security
- ✅ Secure logout with token invalidation

### Role-Based Access Control
- **USER**: Can manage their own tasks (CRUD)
- **ADMIN**: Full access to all tasks + admin panel

### Task Management
- Create, read, update, delete tasks
- Pagination and filtering by status
- Task properties: title, description, status (TODO/IN_PROGRESS/DONE), priority (LOW/MEDIUM/HIGH)
- Redis caching with automatic invalidation

### Security Features
- Helmet.js for secure HTTP headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation and sanitization
- Proper error handling with consistent response format

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional but recommended)
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Backend\ Intern

# Start all services
docker-compose up -d

# Backend will be available at http://localhost:5000
# Swagger docs at http://localhost:5000/api/v1/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/taskdb

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev

# Or start production server
npm start
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start

# Frontend will be available at http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/taskdb
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/v1/tasks` | Create task | Yes | USER/ADMIN |
| GET | `/api/v1/tasks` | Get user tasks (paginated) | Yes | USER/ADMIN |
| GET | `/api/v1/tasks/:id` | Get task by ID | Yes | USER/ADMIN |
| PUT | `/api/v1/tasks/:id` | Update task | Yes | USER/ADMIN |
| DELETE | `/api/v1/tasks/:id` | Delete task | Yes | USER/ADMIN |

### Admin
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/v1/admin/tasks` | Get all users' tasks | Yes | ADMIN |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

---

## 🧪 Testing

```bash
cd backend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 📚 API Documentation

Swagger documentation is available at:
```
http://localhost:5000/api/v1/docs
```

Features:
- Interactive API testing
- Request/response schemas
- Bearer token authentication support

---

## 🎯 Usage Flow

1. **Register**: Create account at `/register`
2. **Login**: Authenticate at `/login` (receives access + refresh tokens)
3. **Dashboard**: View and manage tasks at `/dashboard`
4. **Admin Panel**: (Admin only) View all tasks at `/admin`
5. **Auto-refresh**: Axios interceptor automatically refreshes expired tokens
6. **Logout**: Invalidates refresh token

---

## 📈 Scalability Strategy

### 1. Horizontal Scaling
- **Stateless Architecture**: JWT tokens eliminate server-side session storage
- **Load Balancing**: Deploy multiple backend instances behind NGINX/AWS ALB
- **Database Connection Pooling**: Prisma handles connection pooling automatically
- **Implementation**: Use Kubernetes HPA (Horizontal Pod Autoscaler) to scale based on CPU/memory

### 2. Caching Strategy
- **Current**: Redis caching for task list endpoints with TTL of 300s
- **Cache Invalidation**: Automatic invalidation on write operations (create/update/delete)
- **Future Enhancements**:
  - Cache user profiles and authentication data
  - Implement cache warming for frequently accessed data
  - Use Redis Cluster for distributed caching

### 3. Database Optimization
- **Indexing**: Already implemented on `userId` and `status` columns
- **Read Replicas**: Configure PostgreSQL read replicas for read-heavy operations
- **Query Optimization**: Use Prisma's query optimization features
- **Partitioning**: Partition tasks table by date for large datasets
- **Connection Pooling**: Configure PgBouncer for connection management

### 4. Microservices Decomposition Path
Current monolithic structure can be split into:
- **Auth Service**: User authentication and authorization
- **Task Service**: Task CRUD operations
- **Notification Service**: Email/push notifications
- **Analytics Service**: Task statistics and reporting
- **API Gateway**: Kong/AWS API Gateway for routing and rate limiting

### 5. Frontend Optimization
- **CDN**: Deploy static assets to CloudFront/Cloudflare
- **Code Splitting**: Implement React lazy loading
- **Asset Optimization**: Compress images, minify JS/CSS
- **Service Workers**: Implement PWA for offline support

### 6. Infrastructure Recommendations
- **Container Orchestration**: Kubernetes for container management
- **CI/CD**: GitHub Actions/GitLab CI for automated deployments
- **Monitoring**: Prometheus + Grafana for metrics, ELK stack for logs
- **Database**: AWS RDS/Azure Database for managed PostgreSQL
- **Cache**: AWS ElastiCache/Azure Cache for Redis
- **Message Queue**: RabbitMQ/AWS SQS for async task processing

### 7. Performance Targets
- **Response Time**: < 200ms for 95th percentile
- **Throughput**: 1000+ requests/second per instance
- **Availability**: 99.9% uptime (8.76 hours downtime/year)
- **Scalability**: Support 100K+ concurrent users

---

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ JWT tokens with short expiry times
- ✅ Refresh token rotation prevents token reuse
- ✅ Rate limiting prevents brute force attacks
- ✅ Helmet.js sets secure HTTP headers
- ✅ CORS configured for specific origins
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention via Prisma ORM
- ✅ Environment variables for sensitive data

---

## 📁 Project Structure

```
/backend
  /prisma
    schema.prisma          # Database schema
  /src
    /config
      db.js                # Prisma client
      redis.js             # Redis connection
    /controllers
      authController.js    # Auth handlers
      taskController.js    # Task handlers
    /middleware
      auth.js              # JWT authentication
      validate.js          # Input validation
      error.js             # Global error handler
    /models               # (Prisma handles models)
    /routes
      /v1
        auth.js            # Auth routes
        tasks.js           # Task routes
        admin.js           # Admin routes
        index.js           # Route aggregator
    /services
      authService.js       # Auth business logic
      taskService.js       # Task business logic
    /utils
      jwt.js               # JWT utilities
      logger.js            # Winston logger
  /tests
    auth.test.js           # Auth integration tests
  app.js                   # Express app
  server.js                # Server entry point
  swagger.js               # Swagger config
  package.json
  Dockerfile

/frontend
  /public
    index.html
  /src
    /components
      PrivateRoute.js      # Protected route wrapper
      TaskForm.js          # Task create/edit form
      TaskList.js          # Task list display
    /context
      AuthContext.js       # Auth state management
    /pages
      Register.js          # Registration page
      Login.js             # Login page
      Dashboard.js         # User dashboard
      AdminPanel.js        # Admin panel
    /services
      api.js               # Axios instance with interceptors
      authService.js       # Auth API calls
      taskService.js       # Task API calls
    App.js                 # Main app component
    index.js               # Entry point
    index.css              # Global styles
  package.json

docker-compose.yml         # Multi-container setup
README.md                  # This file
```

---

## 🚦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email required"
    }
  ]
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - feel free to use this project for learning or production.

---

## 👨‍💻 Author

Built with ❤️ for the Backend Intern Challenge

---

## 🎥 Demo

[Include link to Loom video walkthrough]

## 🔗 Live Demo

- **Backend API**: [Deployed URL]
- **Frontend**: [Deployed URL]
- **Swagger Docs**: [Deployed URL]/api/v1/docs

---

## 📮 Postman Collection

Import the Postman collection from `postman_collection.json` to test all endpoints.

### Quick Test Flow:
1. Register user → POST `/api/v1/auth/register`
2. Login → POST `/api/v1/auth/login` (copy accessToken)
3. Set Bearer token in Authorization header
4. Create task → POST `/api/v1/tasks`
5. Get tasks → GET `/api/v1/tasks`
6. Update task → PUT `/api/v1/tasks/:id`
7. Delete task → DELETE `/api/v1/tasks/:id`

---

## 🐛 Known Issues & Future Enhancements

- [ ] Add email verification for registration
- [ ] Implement password reset functionality
- [ ] Add task assignment to other users
- [ ] Implement real-time updates with WebSockets
- [ ] Add file attachments to tasks
- [ ] Implement task comments and activity log
- [ ] Add task due dates and reminders
- [ ] Implement search functionality
- [ ] Add export tasks to CSV/PDF
- [ ] Implement OAuth2 (Google, GitHub login)
