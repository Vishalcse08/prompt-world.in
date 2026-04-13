const { query } = require('./db');

const fix = async () => {
  try {
    await query('UPDATE users SET credits = 1000000 WHERE is_admin = TRUE');
    console.log('Admin credits updated to 1,000,000');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fix();
