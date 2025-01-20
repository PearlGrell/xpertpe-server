import { Request, Response, NextFunction } from "express";

export default function error(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send({
    error: err.message,
  });
}