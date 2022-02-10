const {TaskRecord} = require("../records/taskRecord");

async function getTaskFromRequest(req) {
    const task = new TaskRecord((await TaskRecord.getOne(req.params.id)));
    return task;
}

module.exports = {
    getTaskFromRequest,
}