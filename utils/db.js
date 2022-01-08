const config = require('../config.js')
module.exports = class db {
    static addUser (id) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            database.prepare('INSERT INTO users (discord_id) VALUES (?)').run(id)
            database.prepare(`UPDATE users SET (join_date) = ? WHERE discord_id = ${id}`).run(Date.now())
            database.close()
            resolve()
        });
    }
    static addGuild (id) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            database.prepare('INSERT INTO guilds (discord_id) VALUES (?)').run(id)
            database.prepare(`UPDATE guilds SET (join_date) = ? WHERE discord_id = ${id}`).run(Date.now())
            database.close()
            resolve()
        })
    }
    static getUser (id) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            const row = database.prepare(`SELECT * FROM users WHERE discord_id = ?`).get(id)
            database.close()
            resolve(row)
        })
    }
    static getGuild (id) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            const row = database.prepare(`SELECT * FROM guilds WHERE discord_id = ?`).get(id)
            database.close()
            resolve(row)
        })
    }
    static changeUser (id, column, new_value) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            database.prepare(`UPDATE users SET ${column} = ? WHERE discord_id = ${id}`).run(new_value)
            database.close()
            resolve()
        })
    }
    static changeGuild (id, column, new_value) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            database.prepare(`UPDATE guilds SET ${column} = ? WHERE discord_id = ${id}`).run(new_value)
            database.close()
            resolve()
        })
    }
    static getTable (table) {
        return new Promise((resolve, reject) => {
            const database = require('better-sqlite3')(config.databasePath)
            const row = database.prepare(`SELECT * FROM ${table}`).all()
            database.close()
            resolve(row)
        })
    }
}