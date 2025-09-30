# Transaction Management System

A simple transaction management system with a RESTful API backend and a web-based frontend for managing financial transactions stored in a CSV file.

## Overview

This application allows users to view and add financial transactions through a clean web interface. Transaction data is persisted in a CSV file, and the system assigns random statuses (Pending, Settled, or Failed) to new transactions.

## Features

- **View Transactions**: Display all transactions in a formatted table
- **Add Transactions**: Create new transactions through a modal form
- **Status Tracking**: Visual status indicators with color coding
- **CSV Storage**: Simple file-based data persistence

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Next.js with TypeScript
- **Data Storage**: CSV file
- **Styling**: Tailwind CSS (optional)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.x or higher) - JavaScript runtime
- **npm** (version 9.x or higher) - Package manager (comes with Node.js)
- **Git** - Version control system
- A code editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Checking if Prerequisites are Installed

To verify if you have the required software installed, open your terminal/command prompt and run:

```bash
node --version
npm --version
git --version
```

If any of these commands return "command not found" or similar errors, you'll need to install that software first.

## Project Structure

```
transaction-management-system/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── transactions.js
│   │   ├── controllers/
│   │   │   └── transactionController.js
│   │   └── utils/
│   │       └── csvHandler.js
│   ├── data/
│   │   └── transactions.csv
│   ├── package.json
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── TransactionTable.tsx
│   │   │   └── AddTransactionModal.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── transaction.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── .env.local
└── README.md
```

## Installation

Follow these steps to set up the project on your local machine:

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/yourusername/transaction-management-system.git
cd transaction-management-system
```

### Step 2: Install Backend Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
npm install
```

**What this does**: Downloads all the necessary libraries and packages that the backend needs to run.

### Step 3: Install Frontend Dependencies

Open a new terminal window/tab, navigate to the frontend directory, and install packages:

```bash
cd frontend
npm install
```

**What this does**: Downloads all the necessary libraries and packages that the frontend needs to run.

## Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

2. Add the following configuration (modify values as needed):

```env
PORT=3001
CSV_FILE_PATH=./data/transactions.csv
NODE_ENV=development
```

**Configuration Details**:
- `PORT`: The port number where the backend API will run (default: 3001)
- `CSV_FILE_PATH`: Path to the CSV file that stores transaction data
- `NODE_ENV`: Environment mode (development/production)

### Frontend Configuration

1. Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
touch .env.local  # On Windows: type nul > .env.local
```

2. Add the following configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Configuration Details**:
- `NEXT_PUBLIC_API_URL`: The URL where your backend API is running
- Note: Next.js requires the `NEXT_PUBLIC_` prefix for environment variables accessible in the browser

### Initial Data Setup

The sample data is already included in `backend/data/transactions.csv`. If you need to reset the data, replace the file contents with:

```csv
Transaction Date,Account Number,Account Holder Name,Amount,Status
2025-03-01,7289-3445-1121,Maria Johnson,150.00,Settled
2025-03-02,1122-3456-7890,John Smith,75.50,Pending
2025-03-03,3344-5566-7788,Robert Chen,220.25,Settled
2025-03-04,8899-0011-2233,Sarah Williams,310.75,Failed
2025-03-04,9988-7766-5544,David Garcia,45.99,Pending
2025-03-05,2233-4455-6677,Emily Taylor,500.00,Settled
2025-03-06,1357-2468-9012,Michael Brown,99.95,Settled
2025-03-07,5551-2345-6789,Jennifer Lee,175.25,Pending
2025-03-08,7890-1234-5678,Thomas Wilson,62.50,Failed
2025-03-08,1212-3434-5656,Jessica Martin,830.00,Settled
2025-03-09,9876-5432-1011,Christopher Davis,124.75,Pending
2025-03-10,4646-8282-1919,Amanda Robinson,300.50,Settled
```

## Running the Application

You need to run both the backend and frontend servers. Keep both terminal windows open while using the application.

### Step 1: Start the Backend Server

In the first terminal window:

```bash
cd backend
npm run dev
```

**Expected Output**:
```
Server is running on http://localhost:3001
CSV file loaded successfully
```

**Troubleshooting**:
- If you see "Port 3001 is already in use", either stop the other application using that port or change the PORT in your `.env` file
- If you see "Cannot find module", run `npm install` again in the backend directory
- On Windows, if you see permission errors, try running the terminal as Administrator

### Step 2: Start the Frontend Application

In a second terminal window:

```bash
cd frontend
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

Your default web browser should automatically open to `http://localhost:3000`. If it doesn't, manually open your browser and navigate to that URL.

**Troubleshooting**:
- If you see "Port 3000 is already in use", Next.js will automatically try port 3001, 3002, etc.
- If you see TypeScript errors, ensure all dependencies are installed: `npm install`
- If you see "Module not found" errors, delete `node_modules` and `.next` folder, then run `npm install` again

### Step 3: Verify Everything is Working

1. You should see the transaction table with sample data
2. Click the "Add Transaction" button to test adding a new transaction
3. Check the backend terminal for API request logs

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 1. Get All Transactions

Retrieves all transactions from the CSV file.

**Endpoint**: `GET /transactions`

**Request**:
```bash
curl http://localhost:3001/api/transactions
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "transactionDate": "2025-03-01",
      "accountNumber": "7289-3445-1121",
      "accountHolderName": "Maria Johnson",
      "amount": 150.00,
      "status": "Settled"
    },
    {
      "transactionDate": "2025-03-02",
      "accountNumber": "1122-3456-7890",
      "accountHolderName": "John Smith",
      "amount": 75.50,
      "status": "Pending"
    }
  ],
  "count": 2
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Failed to read transactions"
}
```

#### 2. Add New Transaction

Creates a new transaction and appends it to the CSV file.

**Endpoint**: `POST /transactions`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "transactionDate": "2025-03-15",
  "accountNumber": "1234-5678-9012",
  "accountHolderName": "Jane Doe",
  "amount": 250.75
}
```

**Field Descriptions**:
- `transactionDate` (required): Transaction date in YYYY-MM-DD format
- `accountNumber` (required): Bank account number (string)
- `accountHolderName` (required): Name of the account holder (string)
- `amount` (required): Transaction amount (number, can have decimals)

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Transaction added successfully",
  "data": {
    "transactionDate": "2025-03-15",
    "accountNumber": "1234-5678-9012",
    "accountHolderName": "Jane Doe",
    "amount": 250.75,
    "status": "Pending"
  }
}
```

**Note**: The `status` field is automatically generated and will be randomly assigned as "Pending", "Settled", or "Failed".

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Failed to add transaction"
}
```

### Testing the API with cURL

You can test the API directly using cURL commands:

**Get all transactions**:
```bash
curl http://localhost:3001/api/transactions
```

**Add a new transaction**:
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionDate": "2025-03-15",
    "accountNumber": "1234-5678-9012",
    "accountHolderName": "Jane Doe",
    "amount": 250.75
  }'
```

## Usage Guide

### Viewing Transactions

1. When you open the application, you'll see a table displaying all existing transactions
2. The table shows:
   - Transaction Date
   - Account Number
   - Account Holder Name
   - Amount (formatted as currency)
   - Status (color-coded)

**Status Color Legend**:
- 🟡 Yellow = Pending
- 🟢 Green = Settled
- 🔴 Red = Failed

### Adding a New Transaction

1. Click the **"Add Transaction"** button at the top of the page
2. A modal form will appear with the following fields:
   - **Transaction Date**: Select a date from the date picker
   - **Account Number**: Enter the account number (e.g., 1234-5678-9012)
   - **Account Holder Name**: Enter the full name
   - **Amount**: Enter the transaction amount (e.g., 150.50)
3. Click **"Submit"** to add the transaction
4. The modal will close and the table will automatically update with the new transaction
5. The status will be randomly assigned as Pending, Settled, or Failed

### Form Validation (if implemented)

- All fields are required
- Transaction Date must be a valid date
- Amount must be a positive number
- Account Number should follow a specific format (if validation is added)

## Testing

### Manual Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend application loads successfully
- [ ] Transaction table displays sample data
- [ ] All columns are visible and properly formatted
- [ ] Status colors are correct (Yellow/Green/Red)
- [ ] "Add Transaction" button opens the modal
- [ ] All form fields are present in the modal
- [ ] Form submission adds a new transaction
- [ ] New transaction appears in the table immediately
- [ ] Status is randomly assigned
- [ ] Amount is properly formatted with decimals
- [ ] CSV file is updated with new transactions

### Testing the CSV Persistence

1. Add a few transactions through the UI
2. Stop both the backend and frontend servers
3. Restart both servers
4. Verify that your added transactions still appear in the table

**This confirms** that data is being properly saved to the CSV file.

### API Testing with Postman (Optional)

If you have Postman installed:

1. Import the API endpoints:
   - GET `http://localhost:3001/api/transactions`
   - POST `http://localhost:3001/api/transactions`
2. Test GET request to retrieve transactions
3. Test POST request with the sample JSON body provided in API Documentation
4. Verify responses match the documented format

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot connect to backend" or "Network Error"

**Solution**:
1. Verify the backend server is running (check terminal)
2. Confirm backend is running on port 3001: `http://localhost:3001`
3. Check that `REACT_APP_API_URL` in frontend `.env` matches backend URL
4. Disable browser extensions that might block requests
5. Check browser console for CORS errors

#### Issue: "Port already in use"

**Solution**:
1. Find and stop the application using that port, OR
2. Change the port in your `.env` file to a different number (e.g., 3002, 3003)
3. Update corresponding configuration in the other .env file

#### Issue: Transactions not persisting after restart

**Solution**:
1. Check that `backend/data/transactions.csv` file exists
2. Verify the backend has write permissions to the data directory
3. Check backend terminal for error messages about file operations
4. Ensure `CSV_FILE_PATH` in backend `.env` points to correct location

#### Issue: Table not displaying correctly

**Solution**:
1. Open browser Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Verify API is returning data (Network tab)
4. Clear browser cache and reload
5. Try a different browser

#### Issue: Modal form not submitting

**Solution**:
1. Check browser console for errors
2. Verify all required fields are filled
3. Ensure backend is running and accessible
4. Check Network tab in Developer Tools to see if request is being sent

#### Issue: "Module not found" errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

Do this in both backend and frontend directories.

## Development

### Code Quality Standards

- Use consistent code formatting
- Add comments for complex logic
- Follow REST API best practices
- Handle errors gracefully
- Validate user input

### Project Architecture

**Backend Architecture**:
- Routes: Define API endpoints
- Controllers: Handle business logic
- Utils: Helper functions for CSV operations
- Error handling: Centralized error responses

**Frontend Architecture**:
- Components: Reusable UI elements
- Services: API communication layer
- State management: Handle application state
- Styling: Component-specific or global styles

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Specify your license here - e.g., MIT, Apache 2.0, etc.]

## Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/transaction-management-system](https://github.com/yourusername/transaction-management-system)

## Acknowledgments

- [List any resources, tutorials, or libraries that helped]
- [Credit any third-party code or assets used]
- [Thank contributors]

---

**Last Updated**: September 30, 2025

**Version**: 1.0.0
