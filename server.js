const express = require('express');
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

// POST endpoint to save transaction data
app.post('/api/transactions', (req, res) => {
  try {
    const { transactionDate, accountNumber, accountHolderName, amount, status } = req.body;

    // Validate required fields
    if (!transactionDate || !accountNumber || !accountHolderName || !amount || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['transactionDate', 'accountNumber', 'accountHolderName', 'amount', 'status']
      });
    }

    // Format CSV row
    const row = [
      escapeCSV(transactionDate),
      escapeCSV(accountNumber),
      escapeCSV(accountHolderName),
      escapeCSV(amount),
      escapeCSV(status)
    ].join(',') + '\n';

    // Append to CSV file
    fs.appendFileSync(CSV_FILE, row);

    res.status(201).json({ 
      message: 'Transaction saved successfully',
      data: { transactionDate, accountNumber, accountHolderName, amount, status }
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