import { createServer } from 'http';
import { parse } from 'url';
import app from '../backend/server.js';

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  req.query = parsedUrl.query;
  app(req, res);
});

export default server;