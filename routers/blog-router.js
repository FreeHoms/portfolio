const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('my-database.db');

// Create the blogs table if it doesn't exist
// Drop the existing table
// db.run('DROP TABLE IF EXISTS blogs;', function(err) {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log('Table dropped successfully');
//     }
// });

// Recreate the table with the updated schema
db.run('CREATE TABLE IF NOT EXISTS blogs (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'title TEXT NOT NULL, ' +
    'minor_description TEXT NOT NULL, ' +
    'img_link TEXT NOT NULL, ' +
    'content TEXT NOT NULL' +
');', function(err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Table created successfully');
    }
});


// Create Operation
router.post('/blogs', (req, res) => {
    const { title, minor_description, img_link, content } = req.body;

    if (!title || !minor_description || !img_link || !content) {
        return res.status(400).send('Title, Minor Description, Img Link, and Content are required.');
    }

    const insertStatement = db.prepare('INSERT INTO blogs (title, minor_description, img_link, content) VALUES (?, ?, ?, ?)');
    insertStatement.run(title, minor_description, img_link, content);
    insertStatement.finalize();
    console.log(insertStatement);

    res.redirect('/blogs');
});

// Read Operation
router.get('/blogs', (req, res) => {
    db.all('SELECT * FROM blogs', (err, blogData) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        const context = {
           
            blogData,
        };
        console.log(blogData);
        res.render('blogs', context);
    });
});

//new route for displaying an individual blog
router.get('/blogs/:id', (req, res) => {
    const blogId = req.params.id;
    db.get('SELECT * FROM blogs WHERE id = ?', [blogId], (err, blog) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (!blog) {
            res.status(404).send('Blog not found');
            return;
        }

        res.render('blog', blog);
    });
});

// Update Operation
router.post('/blogs/:id/edit', (req, res) => {
    const blogId = req.params.id;
    const { title, minor_description, img_link, content } = req.body;

    // Check if at least one field is provided (title, minor_description, img_link, or content)
    if (!title && !minor_description && !img_link && !content) {
        return res.status(400).send('At least one of title, minor_description, img_link, or content is required.');
    }

    // Build the SQL update statement dynamically based on the provided fields
    let updateStatement = 'UPDATE blogs SET ';
    const params = [];

    if (title) {
        updateStatement += 'title=?, ';
        params.push(title);
    }

    if (minor_description) {
        updateStatement += 'minor_description=?, ';
        params.push(minor_description);
    }

    if (img_link) {
        updateStatement += 'img_link=?, ';
        params.push(img_link);
    }

    if (content) {
        updateStatement += 'content=?, ';
        params.push(content);
    }

    // Remove the trailing comma and add the WHERE clause
    updateStatement = updateStatement.slice(0, -2);
    updateStatement += ' WHERE id=?';
    params.push(blogId);

    // Prepare and run the dynamic SQL statement
    const dynamicUpdateStatement = db.prepare(updateStatement);
    dynamicUpdateStatement.run(params);
    dynamicUpdateStatement.finalize();

    res.redirect('/blogs');
});

// Delete Operation
router.post('/blogs/:id/delete', (req, res) => {
    const blogId = req.params.id;

    const deleteStatement = db.prepare('DELETE FROM blogs WHERE id=?');
    deleteStatement.run(blogId);
    deleteStatement.finalize();

    res.redirect('/blogs');
});

module.exports = router;
