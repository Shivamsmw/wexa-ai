// Neo4j driver initialization and small helpers.
// Loads credentials from environment variables and exposes a configured driver instance.
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

dotenv.config();

// Read connection details from env (set via server/.env for local dev)
const uri = process.env.COGNODB_URI;
const user = process.env.COGNODB_USER || 'cognodb';
const password = process.env.COGNODB_PASSWORD;

if (!uri || !password) {
  console.error('Missing COGNODB_URI or COGNODB_PASSWORD environment variables.');
  process.exit(1);
}

// Create a single driver used across the app. Close it on process exit if needed.
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Neo4j integer values arrive as objects with `low`/`high` properties when large.
// `unwrapInt` returns the `low` portion for IDs that fit in 32-bit range which
// is sufficient for these demo datasets. If you expect very large IDs, adapt
// this helper to combine high/low safely or use `toNumber()` on the neo4j int.
function unwrapInt(value) {
  if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'low') && Object.prototype.hasOwnProperty.call(value, 'high')) {
    return value.low; // assumes ids fit in 32-bit low
  }
  return value;
}

module.exports = { driver, unwrapInt };
