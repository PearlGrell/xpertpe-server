import { Response } from "express";

export function response(res: Response, status: number, data: any, label?: string): void {
  if(status === 404){
    res.status(404).send({
      error: `${data} not found`
    });
  }
  res.status(status).send({
    [label || 'message']: data
  });
}