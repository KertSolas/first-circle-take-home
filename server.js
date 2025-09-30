const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const CSV_FILE = path.join(__dirname, 'transactions.csv');

// Initialize CSV file with headers if it doesn't exist
function initializeCSV() {
  if (!fs.existsSync(CSV_FILE)) {
    const headers = 'Transaction Date,Account Number,Account Holder Name,Amount,Status\n';
    fs.writeFileSync(CSV_FILE, headers);
  }
}

// Helper function to escape CSV values
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper: return associated account holder name for a formatted account number (or null)
function getAssociatedNameForAccount(formattedAccountNumber) {
  if (!fs.existsSync(CSV_FILE)) return null;
  const data = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = data.trim().split('\n').slice(1); // skip header
  for (const line of lines) {
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const acct = values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"');
    const name = values[2]?.replace(/^"|"$/g, '').replace(/""/g, '"');
    if (acct === formattedAccountNumber) return name || null;
  }
  return null;
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST endpoint to save transaction data
app.post('/api/transactions', (req, res) => {
  try {
    const { transactionDate, accountNumber, accountHolderName, amount, status } = req.body;
    
    // Normalize account number: strip non-digits and require 12 digits
    const normalized = String(accountNumber || '').replace(/\D/g, '');
    if (normalized.length !== 12) {
      return res.status(400).json({ error: 'Account number must contain 12 digits (you may include dashes)' });
    }
    const formattedAccountNumber = normalized.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    
    // Validate required fields
    if (!transactionDate || !accountNumber || !accountHolderName || !amount || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['transactionDate', 'accountNumber', 'accountHolderName', 'amount', 'status']
      });
    }

    if (typeof accountHolderName !== 'string') {
      return res.status(400).json({ error: 'Account holder name must be a string' });
    }

    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }

    // NEW: if account number already exists in CSV, require the provided name to match the stored name
    const existingName = getAssociatedNameForAccount(formattedAccountNumber);
    if (existingName) {
      const provided = String(accountHolderName).trim().toLowerCase();
      const stored = String(existingName).trim().toLowerCase();
      if (provided !== stored) {
        return res.status(400).json({
          error: 'Account number does not match account holder name',
          details: { provided: accountHolderName, expected: existingName }
        });
      }
    }

    // Format CSV row (use formattedAccountNumber so saved value always has dashes)
    const row = [
      escapeCSV(transactionDate),
      escapeCSV(formattedAccountNumber),
      escapeCSV(accountHolderName),
      escapeCSV(amount),
      escapeCSV(status)
    ].join(',') + '\n';

    // Append to CSV file
    fs.appendFileSync(CSV_FILE, row);

    res.status(201).json({ 
      message: 'Transaction saved successfully',
      data: { transactionDate, accountNumber: formattedAccountNumber, accountHolderName, amount, status }
    });
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// GET endpoint to retrieve all transactions
app.get('/api/transactions', (req, res) => {
  try {
    if (!fs.existsSync(CSV_FILE)) {
      return res.json({ transactions: [] });
    }

    const data = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = data.trim().split('\n');
    
    if (lines.length <= 1) {
      return res.json({ transactions: [] });
    }

    const transactions = lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      return {
        transactionDate: values[0]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
        accountNumber: values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
        accountHolderName: values[2]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
        amount: values[3]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
        status: values[4]?.replace(/^"|"$/g, '').replace(/""/g, '"')
      };
    });

    res.json({ transactions });
  } catch (err) {
    console.error('Error reading transactions:', err);
    res.status(500).json({ error: 'Failed to read transactions' });
  }
});

// Initialize CSV and start server
initializeCSV();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CSV file location: ${CSV_FILE}`);
});