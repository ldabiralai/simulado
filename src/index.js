import { start, stop } from './server';
import {
  addMock,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
} from './simulado.js';

export default {
  start,
  stop,
  addMock,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
};
