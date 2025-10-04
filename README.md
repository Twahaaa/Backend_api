# SubDub - Subscription Tracker API

A production-ready backend API built with Node.js, Express, and MongoDB to manage and track user subscriptions with secure authentication, rate limiting, and automated email reminders.

## Features

- **Secure JWT Authentication** - Sign up, sign in, and protected routes
- **Full CRUD for Subscriptions** - Create, read, update, and delete user subscriptions
- **Automated Calculations** - Automatically calculates renewal dates based on subscription frequency
- **Scheduled Reminders** - Uses Upstash Workflows to send timely email reminders before renewals
- **Advanced Security** - Implements Arcjet for rate limiting and bot protection
- **Robust Error Handling** - Centralized middleware for handling and formatting errors
- **Environment-based Configuration** - Easily manage development and production settings

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **Security:** Arcjet (Rate Limiting, Bot Protection)
- **Scheduling:** Upstash (QStash & Workflows)
- **Emailing:** Nodemailer (with Gmail)
- **Date Handling:** Day.js

## Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB Atlas account (free tier available)
- Upstash account (free tier available)
- Arcjet account (free tier available)
- Gmail account with App Password enabled

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd sub-dub-api
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.development.local` in the root directory:
```env
# Server Configuration
PORT=5500
NODE_ENV=development

# MongoDB Database
DB_URI="your_mongodb_connection_string"

# JWT Authentication
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRY="7d"

# Arcjet Security
ARCJET_KEY="your_arcjet_site_key"

# Upstash Workflows (QStash)
QSTASH_URL="your_upstash_qstash_url"
QSTASH_TOKEN="your_upstash_qstash_token"

# Nodemailer (Gmail)
EMAIL_ACCOUNT="your_gmail_address@gmail.com"
EMAIL_PASSWORD="your_gmail_app_password"
```

## Running the Application

**Development mode** (with hot-reloading):
```bash
npm run dev
```

**Upstash local development server** (separate terminal):
```bash
npx qstash-cli@latest dev
```

**Production mode:**
```bash
npm run start
```

The API will be available at `http://localhost:5500`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register a new user |
| POST | `/api/v1/auth/signin` | Sign in and receive JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/:id` | Get user profile (Protected) |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create subscription (Protected) |
| GET | `/api/v1/subscriptions/user/:userId` | Get all user subscriptions |

### Example Request

**POST** `/api/v1/subscriptions`
```json
{
  "name": "YouTube Premium",
  "price": 129.00,
  "currency": "INR",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "upi",
  "startDate": "2025-09-25T00:00:00.000Z"
}
```

## Acknowledgements

This project was built following the comprehensive backend tutorial by [Adrian Hajdin](https://jsmastery.com/) from JavaScript Mastery.

- [YouTube Tutorial](https://www.youtube.com/watch?v=rOpEN1JDaD0)
- [JavaScript Mastery Website](https://jsmastery.com/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
