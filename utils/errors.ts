import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export function handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(err);
    err instanceof ValidationError ? res.status(400).json({message: err.message}) : res.status(500).json({message: 'We have some problems, please try to visit us again in a few minutes'});
}