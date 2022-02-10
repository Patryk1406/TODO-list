const express = require('express');
const {TaskRecord} = require("../records/taskRecord");
const {getTaskFromRequest} = require("../utils/getTaskFromRequest");

const todoListRouter = express.Router()

todoListRouter
    .get('/', async (req, res) => {
        const tasks = await TaskRecord.getAll()
        res.render('todoList/list', {
            tasks,
        })
    })
    .patch('/:id', async (req, res) => {
        const task = await getTaskFromRequest(req);
        task.status = task.status ? 0 : 1;
        task.update()
    })
    .delete('/:id', async (req, res) => {
        const task = await getTaskFromRequest(req);
        task.delete();
    })
    .post('/', async (req, res) => {
        const task = new TaskRecord(req.body);
        const taskId = await task.insert();
        res.status(201).send(JSON.stringify(taskId));
    })

module.exports = {
    todoListRouter,
}