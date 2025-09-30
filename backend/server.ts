import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import { PORT, CSV_FILE } from './src/config/constants';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CSV file location: ${CSV_FILE}`);
});