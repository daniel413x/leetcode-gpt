import { Request, Response } from 'express';

class UtilController {
  async ping(req: Request, res: Response) {
    return res.json(true);
  }
}

export default new UtilController();
