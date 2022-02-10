import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export function handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    err instanceof ValidationError ? res.status(400).send() : res.status(500).send();
}