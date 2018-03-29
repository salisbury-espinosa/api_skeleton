// @flow
import type { $Response, $Request, NextFunction } from "express";

// eslint-disable-next-line import/prefer-default-export
export const asyncUtilWrap = (fn: Function) => (
  req: $Request,
  res: $Response,
  next: NextFunction
): mixed => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
