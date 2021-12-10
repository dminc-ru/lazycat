const sqlite3 = require('sqlite3').verbose();
const config = require('../config.js')
module.exports = class db {
    static add (id, table){
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(`${process.env.PATHTOSQLITE}/lazy.db`);
            db.serialize(() => {
                db.run(`INSERT INTO ${table} (discord_id) VALUES (?)`, [id])
				db.run(`UPDATE ${table} SET (join_date) = ? WHERE discord_id = ${id}`, [Date.now()]);
            })
            db.close()
            resolve()
        });
    }
    static get (id, table){
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(`${process.env.PATHTOSQLITE}/lazy.db`);
            db.serialize(() => {
                db.all(`SELECT * FROM ${table} WHERE discord_id = ${id}`, (err, row) => {
                    if(err) console.log(err)
                    else resolve(row[0]);
                })
            })
            db.close()
        });
    }
    static getTable (table) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(`${process.env.PATHTOSQLITE}/lazy.db`);
            db.serialize(() => {
                db.all(`SELECT * FROM ${table}`, (err, row) => {
                    if(err) console.log(err)
                    else resolve(row)
                })
            })
            db.close()
        })
    }
    static change (id, table, column, new_value){
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(`${process.env.PATHTOSQLITE}/lazy.db`);
            db.serialize(() => {
                db.run(`UPDATE ${table} SET ${column} = ? WHERE discord_id = ${id}`, [new_value]);
            });
            db.close()
            resolve()
        })
    }
}