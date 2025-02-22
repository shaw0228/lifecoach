import { createServer } from 'http';
import app from '../backend/server.js';

export default function handler(req, res) {
  app(req, res);
}