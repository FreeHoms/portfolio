// project-router.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('my-database.db');

// Create Operation
router.post('/projects', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).send('Title and description are required.');
  }

  const insertStatement = db.prepare('INSERT INTO projects (title, description) VALUES (?, ?)');
  insertStatement.run(title, description);
  insertStatement.finalize();

  res.redirect('/projects');
});

// Read Operation
router.get('/projects', (req, res) => {
  db.all('SELECT * FROM projects', (err, projectsData) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('projects', { projectsData, isAuthenticated: req.session.user !== undefined });
  });
});

// Update Operation
router.post('/projects/:id/edit', (req, res) => {
  const projectId = req.params.id;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).send('Title and description are required.');
  }

  const updateStatement = db.prepare('UPDATE projects SET title=?, description=? WHERE id=?');
  updateStatement.run(title, description, projectId);
  updateStatement.finalize();

  res.redirect('/projects');
});

// Delete Operation
router.post('/projects/:id/delete', (req, res) => {
  const projectId = req.params.id;

  const deleteStatement = db.prepare('DELETE FROM projects WHERE id=?');
  deleteStatement.run(projectId);
  deleteStatement.finalize();

  res.redirect('/projects');
});

module.exports = router;
