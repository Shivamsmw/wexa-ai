const express = require('express');
const router = express.Router();
const { driver } = require('../db/driver');

router.get('/', async (req, res) => {
  try {
    await driver.verifyConnectivity();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Database connectivity failed', error.message);
    res.status(500).json({ status: 'error', message: 'Database unreachable' });
  }
});

module.exports = router;
