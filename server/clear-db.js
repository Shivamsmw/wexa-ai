// Utility script to remove all nodes and relationships from the connected DB.
// Useful during development when you want to start from an empty graph.
const neo4j = require('neo4j-driver');
require('dotenv').config();

async function clearDb() {
  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USER;
  const pass = process.env.COGNODB_PASSWORD;
  if (!uri || !user || !pass) {
    console.error('Missing COGNODB_* env vars in server/.env');
    process.exit(1);
  }
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));
  const session = driver.session();
  try {
    console.log('Clearing all nodes and relationships from the database...');
    // Use executeWrite to ensure the driver runs this as a managed transaction.
    await session.executeWrite(async tx => {
      await tx.run('MATCH (n) DETACH DELETE n');
    });
    console.log('Database cleared.');
  } catch (err) {
    console.error('Failed to clear DB:', err);
    process.exitCode = 2;
  } finally {
    await session.close();
    await driver.close();
  }
}

// Allow running directly with `node clear-db.js` or importing as a function.
if (require.main === module) {
  clearDb();
}

module.exports = clearDb;
