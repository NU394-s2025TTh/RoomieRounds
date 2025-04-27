/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as dotenv from 'dotenv';
import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const notifyChore = onRequest(
  { secrets: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'] },
  async (req, res) => {
    logger.info('notifyChore triggered!');
    const { assignee, task, dueDate, phoneNumber } = req.body;

    if (!assignee || !task || !dueDate || !phoneNumber) {
      res.status(400).send('Missing fields');
      return;
    }

    try {
      const message = await client.messages.create({
        body: `Hey ${assignee}! Reminder to complete "${task}" by ${new Date(dueDate).toLocaleDateString()}.`,
        from: fromNumber,
        to: phoneNumber,
      });

      logger.info('Twilio message created successfully!', { sid: message.sid });
      res.status(200).send('Notification sent!');
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Failed to send Twilio message', { error: error.message });
      } else {
        logger.error('Failed to send Twilio message', { error: String(error) });
      }
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
