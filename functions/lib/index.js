'use strict';
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.notifyChore = void 0;
const https_1 = require('firebase-functions/v2/https');
const logger = __importStar(require('firebase-functions/logger'));
const twilio_1 = __importDefault(require('twilio'));
const dotenv = __importStar(require('dotenv'));
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = (0, twilio_1.default)(accountSid, authToken);
exports.notifyChore = (0, https_1.onRequest)(
  { secrets: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'] },
  async (req, res) => {
    logger.info('notifyChore triggered!');
    const { assignee, task, dueDate, phoneNumber } = req.body;
    if (!assignee || !task || !dueDate || !phoneNumber) {
      res.status(400).send('Missing fields');
      return;
    }
    try {
      await client.messages.create({
        body: `Hey ${assignee}! Reminder to complete "${task}" by ${new Date(dueDate).toLocaleDateString()}.`,
        from: fromNumber,
        to: phoneNumber,
      });
      res.status(200).send('Notification sent!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending SMS');
    }
  },
);
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map
