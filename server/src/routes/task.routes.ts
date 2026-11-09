import { Router } from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/task.controller';
import { validateBody } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

const router = Router();

router
    .route('/')
    .get(listTasks)
    .post(validateBody(createTaskSchema), createTask);

router
    .route('/:id')
    .get(getTask)
    .patch(validateBody(updateTaskSchema), updateTask)
    .delete(deleteTask);

export default router;