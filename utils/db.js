const sqlite3 = require('sqlite3').verbose();
const config = require('../config.js')
module.exports = class db {
    static addUser (id) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.run(`INSERT INTO users (discord_id) VALUES (?)`, [id])
				        db.run(`UPDATE users SET (join_date) = ? WHERE discord_id = ${id}`, [Date.now()]);
            })
            db.close()
            resolve()
        });
    }
    static addGuild (id) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.run(`INSERT INTO guilds (discord_id) VALUES (?)`, [id])
                db.run (`UPDATE guilds SET (join_date) = ? WHERE discord_id = ${id}`, [Date.now()]);
            })
        })
    }
    static getUser (id) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.all(`SELECT * FROM users WHERE discord_id = ${id}`, (err, row) => {
                    if (err) console.log(err)
                    else resolve(row[0]);
                })
            })
        })
    }
    static getGuild (id) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.all(`SELECT * FROM guilds WHERE discord_id = ${id}`, (err, row) => {
                    if (err) console.log(err)
                    else resolve(row[0]);
                })
            })
        })
    }
    static changeUser (id, column, new_value) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.run(`UPDATE users SET ${column} = ? WHERE discord_id = ${id}`, [new_value]);
            });
            db.close()
            resolve()
        })
    }
    static changeGuild (id, column, new_value) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.run(`UPDATE guilds SET ${column} = ? WHERE discord_id = ${id}`, [new_value]);
            });
            db.close()
            resolve()
        })
    }
    static getTable (table) {
        return new Promise((resolve, reject) => {
            var db = new sqlite3.Database(config.databasePath);
            db.serialize(() => {
                db.all(`SELECT * FROM ${table}`, (err, row) => {
                    if(err) console.log(err)
                    else resolve(row)
                })
            })
            db.close()
        })
    }
}