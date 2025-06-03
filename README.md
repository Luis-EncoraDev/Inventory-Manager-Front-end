# Inventory Manager - React Frontend

A modern React application for managing product inventory with a clean, responsive interface. This frontend connects to the Inventory Manager Spring Boot API to provide a complete inventory management solution.

## Features

- 📦 Product inventory management
- 🔍 Advanced search and filtering
- 📊 Inventory etrics
- ⚡ Real-time stock updates
- 📄 Pagination for large inventories and sorting

## Prerequisites

- Node.js 16+ 
- npm 8+ or yarn
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Luis-EncoraDev/Inventory-Manager.git
cd inventory-manager-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

## Backend Integration

This React application is designed to work with the Inventory Manager Spring Boot API.

### Prerequisites
Make sure the Spring Boot backend is running on `http://localhost:9090`

### API Endpoints Used
- `GET /api/products` - Fetch products with filtering and pagination
- `POST /api/products` - Create new products
- `PUT /api/products/{id}` - Update existing products
- `DELETE /api/products/{id}` - Delete products
- `POST /api/products/{id}/outofstock` - Mark products out of stock
- `PUT /api/products/{id}/instock` - Mark products in stock
- `GET /api/products/categoryMetrics/{category}` - Get category analytics
