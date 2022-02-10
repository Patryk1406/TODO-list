import {TaskRecord} from "../records/task.record";
import {Request} from "express";


export async function gettingTaskFromRequest(req: Request): Promise<TaskRecord> {
    const task = await TaskRecord.getOne(req.params.id);
    return task;
}