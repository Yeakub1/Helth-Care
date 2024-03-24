import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandlear= (error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.name || "something want wrong",
    error: error,
  });
};

export default globalErrorHandlear