const sqlite = require('better-sqlite3');
const fs = require('fs').promises;

/**
 * Quick.eco sqlite manager
 */
class SqliteManager {
    /**
     * Quick.eco Sqlite Manager
     * @param {object} ops Options
     * @param {string} [ops.table] Sqlite table name 
     * @param {string} [ops.filename] Sqlite file name
     * @param {object} [ops.sqliteOptions] Sqlite options
     */
    constructor(ops = { table: 'money', filename: 'eco', sqliteOptions: {} }) {

        /**
         * Table name
         * @default money
         */
        this.table = ops.table;

        /**
         * Sqlite file name
         * @default eco
         */
        this.filename = ops.filename

        /**
         * Sqlite options
         */
        this.sqliteOptions = ops.sqliteOptions

        /**
         * Whether the database has been init
         * @default false
         */
        this.hasInit = false;

        /**
         * DB to execute raw sql
         */
        this.db;

        this.initDatabase();
    }

    /**
     * Initialize database
     * @param {boolean} force If it should forcefully init database
     * @returns {Promise<boolean>}
     */
    initDatabase(force = false) {
        return new Promise((resolve, reject) => {
            if (force === true) {
                fs.unlink(this.filename)
                    .then(() => {
                        this.db = sqlite(`${this.filename}.sqlite`, this.sqliteOptions);
                        this.hasInit = true;

                        resolve(true);
                    })
                    .catch((e) => reject(e));
            } else {
                if (!this.db) {
                    this.db = sqlite(`${this.filename}.sqlite`, this.sqliteOptions);
                    this.hasInit = true;
                    resolve(true)
                };
            }
        })
    }

    /**
     * Writes data
     * @param {object} data Data
     * @returns {Promise<any>}
     */
    write(rdata) {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))
            if (!rdata || typeof rdata !== 'object') return reject(new Error('Invalid data'));
            const { ID, data } = rdata;

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            this._createTable();

            try {

                const sql = this.db.prepare(`INSERT INTO ${this.table} (ID, data) VALUES (?,?)`).run(ID, data)

                resolve(sql);
            } catch (e) {

                this.update(rdata).then(resolve).catch(reject);
            }
        })
    }

    /**
     * Creates table
     * @private
     */
    _createTable() {
        return this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.table} (ID TEXT UNIQUE, data NUMBER NOT NULL)`).run();
    }

    /**
     * Reads database
     * @param {string} id User ID
     * @returns {Promise<any>}
     */
    read(id) {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))

            this._createTable();

            if (!id || typeof id !== 'string') return resolve(new Error('Invalid ID'));

            const sql = this.db.prepare(`SELECT * FROM ${this.table} WHERE ID = (?)`).get(id);

            resolve(sql);
        })
    }

    /**
     * Updates data
     * @param {object} rdata Data
     * @returns {Promise<any>}
     */
    update(rdata = {}) {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))
            if (!rdata || typeof rdata !== 'object') return reject(new Error('Invalid data'));

            const { ID, data } = rdata;

            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            try {

                const sql = this.db.prepare(`UPDATE ${this.table} SET data = ? WHERE ID = ?`).run(data, ID);

                resolve(sql);

            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * Deletes data
     * @param {string} ID User ID 
     */
    delete(ID) {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))
            if (!ID || typeof ID !== 'string') return reject(new Error('Invalid ID'));

            const sql = this.db.prepare(`DELETE FROM ${this.table} WHERE ID = ?`).run(ID);

            resolve(sql);
        })
    }

    /**
     * Returns all the entries in the table
     * @returns {Promise<object[]>}
     */
    readAll() {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))

            this._createTable();

            const sql = this.db.prepare(`SELECT * FROM ${this.table}`).all();

            resolve(sql)
        })
    }

    /**
     * Deletes all the entries
     * @return {Promise<boolean>}
     */
    deleteAll() {
        return new Promise((resolve, reject) => {
            if (!this.hasInit) return reject(new Error('DB has not been init'))

            const sql = this.db.prepare(`DROP TABLE IF EXISTS ${this.table}`).run();

            return sql;
        })
    }
};

module.exports = SqliteManager;
