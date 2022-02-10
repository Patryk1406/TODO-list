import {Router} from "express";
import {TaskRecord} from "../records/task.record";
import {gettingTaskFromRequest} from "../utils/getting-task-from-request";

export const todoListRouter = Router()

todoListRouter
    .get('/', async (req, res) => {
        const tasks = await TaskRecord.getAll()
        res.render('todoList/list', {
            tasks,
        })
    })
    .post('/', async (req, res) => {
        const task = new TaskRecord(req.body);
        const taskId = await task.insert();
        res.status(201).send(JSON.stringify(taskId));
    })
    .patch('/:id', async (req, res) => {
        const task = await gettingTaskFromRequest(req);
        task.status = task.status ? 0 : 1;
        task.description = req.body.description;
        await task.update();
        res.status(200).send();
    })
    .delete('/:id', async (req, res) => {
        const task = await gettingTaskFromRequest(req);
        await task.delete();
        res.status(200).send();
    })