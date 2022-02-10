import {pool} from "../database/db";
import {v4 as uuid} from "uuid";
import {TaskEntity} from "../types/task-entity";
import {ValidationError} from "../utils/errors";


export class TaskRecord {
    private readonly id: string;
    private _description: string;
    private _status: number;

    constructor(task: TaskEntity) {
        if (!(Number(task.status) === 0 || 1)) {
            throw new Error('The status of a task can only equal 0 or 1.');
        }
        this.id = task.id ?? uuid();
        this._description = task.description;
        this._status = Number(task.status) || 0;
    }

    get status(): number {
        return this._status;
    }

    get description(): string {
        return this._description;
    }

    set status(value: number) {
        this._status = value;
    }

    set description(value: string) {
        this._description = value;
    }

    static async getAll(): Promise<TaskRecord[]> {
        const result = ((await pool.execute('SELECT * FROM `tasks`'))[0] as TaskEntity[]);
        return result.map(task => new TaskRecord(task));
    }

    static async getOne(id: string): Promise<TaskRecord> {
        const [task] = ((await pool.execute('SELECT * FROM `tasks` WHERE `id` = :id', {
            id,
        }))[0] as TaskEntity[]);
        if (!task) {
            throw new ValidationError('A task with the id given by you doesn\'t exits!');
        }
        return new TaskRecord(task);
    }

    async insert(): Promise<string> {
        await pool.execute('INSERT INTO `tasks` VALUES(:id, :description, :status)', {
            id: this.id,
            description: this._description,
            status: this._status,
        });
        return this.id;
    }

    async update(): Promise<string> {
        await pool.execute('UPDATE `tasks` SET `description` = :description, `status` = :status WHERE `id` = :id',  {
            description: this._description,
            status: this._status,
            id: this.id,
        });
        return this.id;
    }

    async delete(): Promise<string> {
        await pool.execute('DELETE FROM `tasks` WHERE `id` = :id', {
            id: this.id,
        });
        return this.id;
    }
}