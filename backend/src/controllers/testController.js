const mysql = require("mysql2");
const conn = require('../config/db')

const getTests = (res)=>{
    let sqlreq = "SELECT * FROM test";
    conn.query = (sqlreq, (err, results)=>{
        if (err){
            console.log("Error fetching tests")
        }
        res.status(200).json(results);
    });
}; 
const postTests = (req, res)=>{
    let sqlreq = "INSERT INTO test (name, description, start, end, timelimit_min) values (?,?,?,?,?)"
    conn.execute = (sqlreq, (err, results)=>{
        if (err){
            console.log("Error adding to database")
        }
    })
}
module.exports = {
    getTests,
    postTests
};