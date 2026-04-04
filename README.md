# ReviewRoot

**Where Reviews Begin and Trust Grows**

A complete feedback and review collection system built with Node.js, Express, and MongoDB.

---

## Features

- **Business Dashboard**: Create products, manage reviews, export data
- **Customer Reviews**: Easy-to-use feedback forms with star ratings
- **Reviewer Accounts**: Customers can create accounts to track their reviews
- **Real-time Stats**: View average ratings, review counts, monthly trends
- **Export Options**: Export products and reviews to CSV
- **Security**: Password hashing, JWT authentication, helmet & CORS

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: HTML, CSS, Bootstrap 5
- **Authentication**: JWT, bcrypt

---

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Visit: http://localhost:3000

---

## Environment Variables

Create a `.env` file:

```env
# MongoDB Connection (REQUIRED)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Server Port
PORT=3000

# Environment
NODE_ENV=development

# Base URL for feedback links
BASE_URL=http://localhost:3000

# JWT Secret (change in production!)
JWT_SECRET=your_secret_key
```

---

## Project Structure

```
├── models/           # Database models
│   ├── businessModel.js
│   ├── productModel.js
│   ├── reviewModel.js
│   └── reviewerModel.js
├── routes/           # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   └── reviewerRoutes.js
├── public/           # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── feedback.html
│   ├── thankyou.html
│   └── reviewer-dashboard.html
├── server.js         # Main server file
├── package.json
├── .env             # Environment variables
├── README.md
└── DEPLOY.md        # Deployment guide
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Business registration
- `POST /api/auth/login` - Business login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Reviews
- `GET /api/reviews` - Get approved reviews
- `POST /api/reviews` - Create review

### Reviewers
- `POST /api/reviewers/register` - Customer registration
- `POST /api/reviewers/login` - Customer login
- `GET /api/reviewers/my-reviews` - Get customer's reviews
- `PUT /api/reviewers/profile` - Update profile
- `PUT /api/reviewers/password` - Change password

### Health
- `GET /api/health` - Server health check

---

## Deployment

See `DEPLOY.md` for detailed step-by-step deployment instructions to Render.com.

### Quick Deploy

1. Push code to GitHub
2. Connect GitHub to Render.com
3. Add environment variables
4. Deploy!

---

## License

MIT
