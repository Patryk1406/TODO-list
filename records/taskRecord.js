const {v4: uuid} = require('uuid');
const {pool} = require("../database/db");

class TaskRecord {
    constructor(task) {
        if (!(task.status === 0 || 1)) {
            throw new Error('The status of a task can only equal to 0 or 1.')
        }
        this.id = task.id ?? uuid();
        this.description = task.description;
        this.status = task.status || 0;
    }

    static async getAll() {
        const result = (await pool.execute('SELECT * FROM `tasks`'))[0];
        return result
    }

    static async getOne(id) {
        const result = (await pool.execute('SELECT * FROM `tasks` WHERE `id` = :id', {
            id,
        }))[0];
        return result[0];
    }

    async insert() {
        const result = (await pool.execute('INSERT INTO `tasks` VALUES(:id, :description, :status)', {
            id: this.id,
            description: this.description,
            status: this.status,
        }))[0];
        return this.id;
    }

    async update() {
        await pool.execute('UPDATE `tasks` SET `description` = :description, `status` = :status WHERE `id` = :id',  {
            description: this.description,
            status: this.status,
            id: this.id,
        })
    }

    async delete() {
        await pool.execute('DELETE FROM `tasks` WHERE `id` = :id', {
            id: this.id,
        });
    }
}

module.exports = {
    TaskRecord,
}