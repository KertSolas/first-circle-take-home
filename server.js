const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const CSV_FILE = path.join(__dirname, 'transactions.csv');
const CSV_HEADERS = 'Transaction Date,Account Number,Account Holder Name,Amount,Status\n';
const FIELD_EXTRACT_RE = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;

// Ensure CSV exists with header
function initializeCSV() {
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, CSV_HEADERS);
  }
}

/* CSV helpers */

// Escape a single value for CSV (quote when needed, double internal quotes)
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Parse a CSV field value (remove surrounding quotes and unescape "")
function parseCSVField(field = '') {
  return String(field).replace(/^"|"$/g, '').replace(/""/g, '"');
}

// Read all CSV lines (returns array of lines, header included)
function readCSVLines() {
  if (!fs.existsSync(CSV_FILE)) return [];
  const data = fs.readFileSync(CSV_FILE, 'utf8');
  return data.split('\n').filter(() => true); // preserve empty last line if any
}

// Append a row array to CSV file (joins with commas)
function appendCSVRow(values = []) {
  const row = values.map(escapeCSV).join(',') + '\n';
  fs.appendFileSync(CSV_FILE, row);
}

/* Validation / formatting helpers */

// Normalize accountNumber: strip non-digits, require exactly 12 digits, return dashed format
function formatAccountNumber(input) {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length !== 12) return null;
  return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
}

// Parse and validate amount: must be numeric and > 0
function parseValidAmount(input) {
  const n = parseFloat(input);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

// Find associated account holder name for a formatted account number, or null
function findAccountHolderByAccountNumber(formattedAccountNumber) {
  if (!fs.existsSync(CSV_FILE)) return null;
  const data = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = data.trim().split('\n').slice(1); // skip header
  for (const line of lines) {
    const values = line.match(FIELD_EXTRACT_RE) || [];
    const acct = parseCSVField(values[1]);
    const name = parseCSVField(values[2]);
    if (acct === formattedAccountNumber) return name || null;
  }
  return null;
}

/* CORS (specific dev origin) */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next(); 
});

/* POST /api/transactions */
// Expected body: { transactionDate, accountNumber, accountHolderName, amount, status }
app.post('/api/transactions', (req, res) => {
  try {
    const { transactionDate, accountNumber, accountHolderName, amount, status } = req.body || {};

    // Basic required fields
    if (!transactionDate || !accountNumber || !accountHolderName || amount === undefined || !status) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['transactionDate', 'accountNumber', 'accountHolderName', 'amount', 'status']
      });
    }

    // Normalize and validate account number -> dashed 4-4-4
    const formattedAccountNumber = formatAccountNumber(accountNumber);
    if (!formattedAccountNumber) {
      return res.status(400).json({ error: 'Account number must contain exactly 12 digits (dashes optional)' });
    }

    // Validate account holder name
    if (typeof accountHolderName !== 'string' || accountHolderName.trim() === '') {
      return res.status(400).json({ error: 'Account holder name must be a non-empty string' });
    }

    // Validate amount > 0
    const parsedAmount = parseValidAmount(amount);
    if (parsedAmount === null) {
      return res.status(400).json({ error: 'Amount must be a number greater than 0' });
    }

    // If account already exists, enforce matching name (case-insensitive, trimmed)
    const existingName = findAccountHolderByAccountNumber(formattedAccountNumber);
    if (existingName) {
      const provided = accountHolderName.trim().toLowerCase();
      const stored = existingName.trim().toLowerCase();
      if (provided !== stored) {
        return res.status(400).json({
          error: 'Account number does not match account holder name',
          details: { provided: accountHolderName, expected: existingName }
        });
      }
    }

    // All good -> append to CSV (use formatted account number and original amount string/number)
    appendCSVRow([
      transactionDate,
      formattedAccountNumber,
      accountHolderName,
      parsedAmount, // store numeric normalized amount
      status
    ]);

    return res.status(201).json({
      message: 'Transaction saved successfully',
      data: { transactionDate, accountNumber: formattedAccountNumber, accountHolderName, amount: parsedAmount, status }
    });
  } catch (err) {
    console.error('Error saving transaction:', err);
    return res.status(500).json({ error: 'Failed to save transaction' });
  }
});

/* GET /api/transactions */
app.get('/api/transactions', (req, res) => {
  try {
    if (!fs.existsSync(CSV_FILE)) {
      return res.json({ transactions: [] });
    }

    const data = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = data.trim().split('\n');

    // No rows beyond header
    if (lines.length <= 1) return res.json({ transactions: [] });

    const transactions = lines.slice(1).map(line => {
      const values = line.match(FIELD_EXTRACT_RE) || [];
      return {
        transactionDate: parseCSVField(values[0]),
        accountNumber: parseCSVField(values[1]),
        accountHolderName: parseCSVField(values[2]),
        amount: parseCSVField(values[3]),
        status: parseCSVField(values[4])
      };
    });

    return res.json({ transactions });
  } catch (err) {
    console.error('Error reading transactions:', err);
    return res.status(500).json({ error: 'Failed to read transactions' });
  }
});

/* Start */
initializeCSV();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CSV file location: ${CSV_FILE}`);
});