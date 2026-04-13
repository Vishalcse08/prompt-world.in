const { query } = require('./db');

const fix = async () => {
  try {
    // Update all existing non-admin users to have 2000 credits
    await query('UPDATE users SET credits = 2000 WHERE is_admin = FALSE');
    console.log('All users credits updated to 2000');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fix();
