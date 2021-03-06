import { Request, Response } from "express";
import { Test } from "../models/Test";
import { MoscaMessage } from "../models/MoscaMessage";
import { DBMessageDAO } from "../daos/DBMessageDAO";
import { DBTestDAO } from "../daos/DBTestDAO";
import { Client } from "pg";

export let create = async (req: Request, res: Response) => {
  const fileName = req.body.fileName;
  const client = new Client();
  const testDAO = new DBTestDAO(client);
  const messageDAO = new DBMessageDAO(client);
  client.connect();

  const fullTest = await testDAO.byName(fileName);
  const messages = await messageDAO.allByTestName(req.body.fileName);

  const moscaMessages = messages.map(m => MoscaMessage.instance(m));
  res.json(new Test(moscaMessages, fullTest).json);
  client.end();

};
