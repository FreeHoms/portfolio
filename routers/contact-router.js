const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('my-database.db');

db.run('CREATE TABLE IF NOT EXISTS contact (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'fullname TEXT NOT NULL, ' +
    'email TEXT NOT NULL, ' +
    'message TEXT NOT NULL' +
');', function(err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Contact table created successfully');
    }
});


// Create Operation
router.post('/contact', (req, res) => {
    if (req.session.isAuthenticated){
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
        return res.status(400).send('Full Name, Email, and Message are required.');
    }

    const insertStatement = db.prepare('INSERT INTO contact (fullname, email, message) VALUES (?, ?, ?)');
    insertStatement.run(fullname, email, message);
    insertStatement.finalize();

    const success = 'Message sent successfully!';
    res.render('contact', { success });
}
});

// Read Operation for the contact page
router.get('/contact', (req, res) => {
   if (req.session.isAuthenticated){

    db.all('SELECT * FROM contact ORDER BY id DESC', (err, messages) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        const context = {
            messages,
        };

        res.render('message', context);
    });
   }

   else{
     res.render('contact')
   }
   
});

// Delete Operation
router.post('/contact/:id/delete', (req, res) => {
    if (req.session.isAuthenticated){
    const messageId  = req.params.id;
  
    const deleteStatement = db.prepare('DELETE FROM contact WHERE id=?');
    deleteStatement.run(messageId );
    deleteStatement.finalize();
  
    res.redirect('/contact');
    }
  });

module.exports = router;