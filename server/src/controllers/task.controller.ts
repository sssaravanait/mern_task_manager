import type { RequestHandler } from 'express';
import { taskService } from '../services/task.service';
import type { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';
import { listTasksQuery, taskIdParams } from '../validators/task.validator';

export const listTasks: RequestHandler = async (req, res) => {
    const { completed, page, limit } = listTasksQuery.parse(req.query);
    const result = await taskService.list({ completed, page, limit });
    res.json({ success: true, ...result });
};

export const getTask: RequestHandler = async (req, res) => {
    const { id } = taskIdParams.parse(req.params);
    const task = await taskService.getById(id);
    res.json({ success: true, data: task });
};

export const createTask: RequestHandler = async (req, res) => {
    const task = await taskService.create(req.body as CreateTaskInput);
    res.status(201).json({ success: true, data: task });
};

export const updateTask: RequestHandler = async (req, res) => {
    const { id } = taskIdParams.parse(req.params);
    const task = await taskService.update(id, req.body as UpdateTaskInput);
    res.json({ success: true, data: task });
};

export const deleteTask: RequestHandler = async (req, res) => {
    const { id } = taskIdParams.parse(req.params);
    await taskService.remove(id);
    res.status(204).end();
};