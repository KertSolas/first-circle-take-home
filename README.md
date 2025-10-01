## Features

- **View Transactions**: Display all transactions in a formatted table
- **Add Transactions**: Create new transactions through a modal form
- **Status Tracking**: Visual status indicators with color coding
- **CSV Storage**: Simple file-based data persistence

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Next.js with TypeScript
- **Data Storage**: CSV file
- **Styling**: Tailwind CSS

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
│   ├── package.json
│   ├── .env
│   └── server.js
|   ├── 
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── StatusBadge.tsx
│   │   │   └── TransactionForm.tsx
|   |   |   └── TransactionTable.tsx
│   │   ├── hooks/
│   │   │   └── useTransaction.ts
|   |   ├── types/
|   |   |   ├── Transaction.ts
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
git clone https://github.com/KertSolas/first-circle-take-home.git
cd first-circle-take-home
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
NEXT_PUBLIC_API_URL=http://localhost:3000
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
Server is running on http://localhost:3000
CSV file loaded successfully
```

**Troubleshooting**:
- If you see "Port 3000 is already in use", either stop the other application using that port or change the PORT in your `.env` file
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
  - Local:        http://localhost:3001
  - Network:      http://192.168.x.x:3001

 ✓ Ready in 2.3s
```

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
http://localhost:3000/api
```

### Endpoints

#### 1. Get All Transactions

Retrieves all transactions from the CSV file.

**Endpoint**: `GET /transactions`

**Request**:
```bash
curl http://localhost:3000/api/transactions
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
curl http://localhost:3000/api/transactions
```

**Add a new transaction**:
```bash
curl -X POST http://localhost:3000/api/transactions \
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
- Account Number should have 12 digits
- Account Number should match the name of Account holder

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

**Last Updated**: September 30, 2025

**Version**: 1.0.0
