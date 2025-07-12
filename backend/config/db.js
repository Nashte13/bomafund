//config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'Nash', 
    password: 'nahashon8961', 
    database: 'bomafund' 
});

connection.connect((err) => {
    if (err) {
        console.error('❌MySQL connection failed:', err);
        return;
    }
    console.log('✅MySQL connected successfully');
});

module.exports = connection;