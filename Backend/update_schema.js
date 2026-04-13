const { query } = require('./db');

const fix = async () => {
  try {
    await query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS platform VARCHAR(50)');
    await query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS app_type VARCHAR(50)');
    console.log('Columns added successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fix();
