// project-router.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('my-database.db');

// Create Operation
router.post('/projects', (req, res) => {
if(req.session.isAuthenticated){

  const { title, description, link } = req.body;

  if (!title || !description || !link) {
    return res.status(400).send('Title, description, and link are required.');
  }

  const insertStatement = db.prepare('INSERT INTO projects (title, description, link) VALUES (?, ?, ?)');
  insertStatement.run(title, description, link);
  insertStatement.finalize();

  res.redirect('/projects');
}
});

// Read Operation
router.get('/projects', (req, res) => {
  db.all('SELECT * FROM projects', (err, projectsData) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    const context = {
      projectsData,
    };

    res.render('projects', context);
  });
});

// Update Operation
router.post('/projects/:id/edit', (req, res) => {
if(req.session.isAuthenticated){

    const projectId = req.params.id;
    const { title, description, link } = req.body;
  
    // Check if at least one field is provided (title, description, or link)
    if (!title && !description && !link) {
      return res.status(400).send('At least one of title, description, or link is required.');
    }
  
    // Build the SQL update statement dynamically based on the provided fields
    let updateStatement = 'UPDATE projects SET ';
    const params = [];
  
    if (title) {
      updateStatement += 'title=?, ';
      params.push(title);
    }
  
    if (description) {
      updateStatement += 'description=?, ';
      params.push(description);
    }
  
    if (link) {
      updateStatement += 'link=?, ';
      params.push(link);
    }
  
    // Remove the trailing comma and add the WHERE clause
    updateStatement = updateStatement.slice(0, -2); 
    updateStatement += ' WHERE id=?';
    params.push(projectId);
  
    // Prepare and run the dynamic SQL statement
    const dynamicUpdateStatement = db.prepare(updateStatement);
    dynamicUpdateStatement.run(params);
    dynamicUpdateStatement.finalize();
  
    res.redirect('/projects');
  }
  });
  
// Delete Operation
router.post('/projects/:id/delete', (req, res) => {
if(req.session.isAuthenticated){

  const projectId = req.params.id;

  const deleteStatement = db.prepare('DELETE FROM projects WHERE id=?');
  deleteStatement.run(projectId);
  deleteStatement.finalize();

  res.redirect('/projects');
}
});

module.exports = router;
