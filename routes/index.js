import express from 'express';
import { indexRouteController } from '../controllers/index.js';

const router = express.Router();

router.get('/', indexRouteController);

export default router;