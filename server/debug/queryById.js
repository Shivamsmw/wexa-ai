// Small debug helper to inspect a Book node by internal id.
// Keep this under `server/debug/` so it's clear this is not part of the app.
const { driver } = require('../src/db/driver');

async function query(id) {
  const session = driver.session();
  try {
    const res = await session.run('MATCH (b:Book) WHERE id(b) = $id RETURN id(b) as id, b.title as title', { id });
    console.log(res.records.map(r => ({ id: r.get('id'), title: r.get('title') })));
  } catch (e) {
    console.error(e);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Default id is 109 for convenience when run during debugging sessions.
query(Number(process.argv[2] || 109));
