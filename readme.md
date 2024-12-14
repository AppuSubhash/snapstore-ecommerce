# SnapStore eCommerce Platform (v2)

> Full-featured eCommerce platform built with the MERN stack & Redux Toolkit.

![Screenshot](./frontend/public/images/screens.png)

This project is part of the [MERN Stack From Scratch | eCommerce Platform](https://www.traversymedia.com/mern-stack-from-scratch) course. It includes features like product management and user authentication.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Install Dependencies](#install-dependencies)
  - [Running the Application](#running-the-application)
- [Build and Deploy](#build-and-deploy)
  - [Seeding the Database](#seeding-the-database)
- [Bug Fixes and FAQ](#bug-fixes-and-faq)
  - [Known Issues](#known-issues)

## Features

- Shopping cart functionality
- Product reviews and ratings
- Admin dashboards for user and product management
- Top products carousel, search, and pagination
- Database seeding for sample data

## Getting Started

### Environment Variables

Rename `.env.example` to `.env` and add the following values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your Secret Key>
PAGINATION_LIMIT=8
```

Update `JWT_SECRET` and `PAGINATION_LIMIT` as desired.

### Install Dependencies

Run the following commands:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Running the Application

```bash
# Run both frontend (:3000) and backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build and Deploy

```bash
# Create a production build for the frontend
cd frontend
npm run build
```

### Seeding the Database

Commands to seed or destroy data in the database:

```bash
# Seed database with sample users and products
npm run data:import

# Destroy all data
npm run data:destroy
```

Sample User Logins:

- **Admin:** admin@email.com / 123456
- **Customer:** john@email.com / 123456

## Bug Fixes and FAQ

### Known Issues

#### 1. ProfileScreen Warnings
Warnings like `<tD> cannot appear as a child of <tr>` appear due to JSX structure issues. Review the updated code in `ProfileScreen.jsx` for fixes.

#### 2. Handling File Upload Types
Admins can currently upload unsupported file types when updating product images. Fixed by implementing a file filter in `uploadRoutes.js`.

#### 3. Incorrect Error Handling
Errors thrown in `productControllers` may not return custom error messages. Check updates in `errorMiddleware.js` and `productRoutes.js`.

---

For additional bugs and solutions, including floating-point calculation fixes, invalid token handling, and more, refer to the full list in the project repository.



