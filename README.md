# Rent Management System

A comprehensive rental management solution built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- 🏢 **Building Management** - Manage multiple buildings and their flats
- 👥 **Tenant Management** - Complete tenant profiles with family members
- 💰 **Payment Tracking** - Record and track rent and utility payments
- 🔧 **Service Requests** - Handle maintenance and service requests
- 🔐 **Role-Based Access Control** - Admin, Manager, Staff, and Tenant roles
- 📊 **Dashboard** - Overview of occupancy, revenue, and statistics
- 🔒 **Secure Authentication** - JWT-based authentication with HTTP-only cookies

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Prisma with SQLite
- **Authentication:** JWT (jose)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Styling:** CSS Modules

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rentManagement
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
```

**Important:** Generate a strong random string for `JWT_SECRET` in production!

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rentManagement/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   ├── components/      # React components
│   ├── dashboard/       # Dashboard pages
│   └── layout.tsx       # Root layout
├── lib/
│   ├── auth.ts         # Authentication utilities
│   ├── auth-middleware.ts  # Auth middleware
│   ├── db.ts           # Prisma client
│   ├── validations.ts  # Zod schemas
│   ├── api-response.ts # Standardized responses
│   ├── logger.ts       # Logging utility
│   └── file-storage.ts # File storage utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── public/             # Static assets
```

## API Documentation

Comprehensive API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick API Overview

- **Authentication:** `/api/auth/*`
- **Buildings:** `/api/buildings`
- **Flats:** `/api/buildings/[id]/flats`
- **Tenants:** `/api/tenants`
- **Payments:** `/api/rent`
- **Service Requests:** `/api/requests`
- **Family Members:** `/api/tenants/[id]/family`

All endpoints require authentication except `/api/auth/login`.

## User Roles

### ADMIN
- Full access to all features
- Can create users, buildings, tenants
- Can manage all data

### MANAGER
- Can create buildings and tenants
- Can manage payments and service requests
- Cannot create other admins/managers

### STAFF
- Can create tenants
- Can record payments
- Can view all data

### TENANT
- Can view own profile and data
- Can create service requests for themselves
- Can manage own family members
- Limited access to other resources

## Security Features

- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)
- ✅ CSRF protection (SameSite cookies)

## Database Schema

The system includes the following main models:

- **User** - System users (admins, managers, staff, tenants)
- **Building** - Property buildings
- **Flat** - Individual units within buildings
- **Tenant** - Tenant information linked to users
- **FamilyMember** - Family members of tenants
- **Payment** - Rent and utility payments
- **UtilityBill** - Utility bill records
- **ServiceRequest** - Maintenance and service requests

See `prisma/schema.prisma` for complete schema definition.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Regenerate Prisma Client

## Production Deployment

### Environment Variables

Ensure these are set in production:

```
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret-key"
NODE_ENV="production"
```

### Database

For production, consider migrating from SQLite to PostgreSQL or MySQL:

1. Update `prisma/schema.prisma` datasource
2. Update `DATABASE_URL` in environment
3. Run migrations: `npx prisma migrate deploy`

### Security Checklist

- [ ] Set strong `JWT_SECRET` in production
- [ ] Use HTTPS in production
- [ ] Enable secure cookies (`secure: true`)
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Regular database backups
- [ ] Use environment-specific configurations

## Features Roadmap

- [ ] Email notifications
- [ ] PDF invoice generation
- [ ] Advanced reporting and analytics
- [ ] Mobile app
- [ ] Online payment integration
- [ ] Document management system
- [ ] Automated rent reminders
- [ ] Multi-currency support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**

