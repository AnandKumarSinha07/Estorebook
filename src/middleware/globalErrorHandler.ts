
import app from "../app";
import { HttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import {config} from '../config/config'


const globalErrorHandler=(err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : "",
    });
};

export default globalErrorHandler;