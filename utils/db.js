const sqlite3 = require('sqlite3').verbose();
module.exports = class db {
    /**
     * Добавить новую запись в БД
     * @param {string} id ID пользователя/сервера
     * @param {string} table Изменяемая таблица
     * @returns {Promise<any>}
     */
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
    /**
     * Получить запись из БД
     * @param {string} id ID пользователя/сервера
     * @param {string} table Таблица
     * @returns {Promise<any>}
     */
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
    /**
     * Получить всю таблицу данных
     * @param {string} table Таблица 
     * @returns {Promise<any>} 
     */
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
    /**
     * Изменить значение в базе данных
     * @param {string} id ID пользователя/сервера
     * @param {string} table Изменяемая таблица
     * @param {string} column Изменяемая колонка
     * @param {string} new_value Новое значение
     * @returns {Promise<any>}
     */
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