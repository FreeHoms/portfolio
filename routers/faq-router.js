const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('my-database.db');

db.run('CREATE TABLE IF NOT EXISTS faq (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'question TEXT NOT NULL, ' +
    'answer TEXT NOT NULL' +
');', function(err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('FAQ table created successfully');
    }
});


// Create Operation
router.post('/faq', (req, res) => {
if(req.session.isAuthenticated){

    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).send('Question and answer are required.');
    }

    const insertStatement = db.prepare('INSERT INTO faq (question, answer) VALUES (?, ?)');
    insertStatement.run(question, answer);
    insertStatement.finalize();

    res.redirect('/faq');
}
});

// Read Operation
router.get('/faq', (req, res) => {
    db.all('SELECT * FROM faq', (err, faqData) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        const context = {
            faqData,
        };

        res.render('faq', context);
    });
});

// Update Operation
router.post('/faq/:id/edit', (req, res) => {
if(req.session.isAuthenticated){

    const faqId = req.params.id;
    const { question, answer } = req.body;

    if (!question && !answer) {
        return res.status(400).send('At least one of question or answer is required.');
    }

    let updateStatement = 'UPDATE faq SET ';
    const params = [];

    if (question) {
        updateStatement += 'question=?, ';
        params.push(question);
    }

    if (answer) {
        updateStatement += 'answer=?, ';
        params.push(answer);
    }

    updateStatement = updateStatement.slice(0, -2);
    updateStatement += ' WHERE id=?';
    params.push(faqId);

    const dynamicUpdateStatement = db.prepare(updateStatement);
    dynamicUpdateStatement.run(params);
    dynamicUpdateStatement.finalize();

    res.redirect('/faq');
}
});

// Delete Operation
router.post('/faq/:id/delete', (req, res) => {
if(req.session.isAuthenticated){

    const faqId = req.params.id;

    const deleteStatement = db.prepare('DELETE FROM faq WHERE id=?');
    deleteStatement.run(faqId);
    deleteStatement.finalize();

    res.redirect('/faq');
}
});

module.exports = router;
