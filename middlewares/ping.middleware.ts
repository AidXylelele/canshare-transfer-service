import { FetchTool } from "../tools/fetch.tool";
import { NextFunction, Response } from "express";

const fetchTool = new FetchTool();

export const ping = async (
  req: any,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;

    for (const field in body) {
      const url = body[field];
      await fetchTool.ping(url);
    }

    next();
  } catch (error) {
    next(error);
  }
};
