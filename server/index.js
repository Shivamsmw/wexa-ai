// Minimal bootstrap: load the application factory and start listening.
// Keeping this file tiny makes the app easier to test and reuse (e.g. for Lambda wrappers).
const app = require('./src/app');

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
