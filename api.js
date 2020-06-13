const express = require('express');
const cors = require('cors')
const mysql = require('mysql')
const app = express();



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'rmutl'
});

connection.connect(err => {
    if(err){
        return err;
    }
});

console.log(connection);
app.use(cors());

// app.get('/users/delete', (req, res) => {
//     const { id } = req.query;
//     const DELETE_QUERY = 'DELETE FROM users WHERE userid = ?';
//     connection.query(DELETE_QUERY,id,(err,results) => {
//         if(err) {
//             return res.send(err)
//         }
//         else {
//             return res.send('successfully DELETE users')
//         }
//     }); 
// });

app.get('/getAllUser', (req, res) => {
    const SELECT_ALL_PRODUCT_QUERY = 'SELECT * FROM user_data';
    connection.query(SELECT_ALL_PRODUCT_QUERY, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

app.get('/getHealthUser/:User_ID', (req, res) => {
    const SELECT_ALL_PRODUCT_QUERY = 'SELECT User_ID,Health_weight,Health_height,Health_BMI,Health_pressure,Health_pulse,Health_temp,Health_date FROM health_data WHERE User_ID = ' + req.params.User_ID;
    connection.query(SELECT_ALL_PRODUCT_QUERY, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else{ 
            return res.json({
                data: results
            })
        }
    })
});

// app.get('/getHealth/:User_ID', (req, res) => {
//     const SELECT_ALL_PRODUCT_QUERY = 'SELECT * FROM health_data WHERE User_ID = ' + req.params.User_ID;
//     connection.query(SELECT_ALL_PRODUCT_QUERY, (err,results) => {
//         if(err) {
//             return res.send(err)
//         }
//         else{ 
//             return res.json({
//                 data: results
//             })
//         }
//     })
//});

app.listen(3100, () => {
    console.log('Products server listening on port 3100');
});