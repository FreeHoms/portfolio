const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('my-database.db');

function setupDatabase() {
    // Create the projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating projects table:', err.message);
        db.close();
        return;
      }
  
      // Insert data into the projects table
      const projectsData = [
        { title: 'Project 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' },
        { title: 'Project 2', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' }
        // Add more projects as needed
      ];
  
      const insertStatement = db.prepare('INSERT INTO projects (title, description) VALUES (?, ?)');
  
      projectsData.forEach((project) => {
        insertStatement.run(project.title, project.description);
      });
  
      insertStatement.finalize();
  
      console.log('Projects table created and data inserted successfully');
  
      // Close the database connection
      db.close();
    });
  }
  
  module.exports = { setupDatabase };