import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const sid = process.env.TWILIO_SMS_SID!;

const client = new Twilio(accountSid, authToken);

export const sendMessage = (to: string, from: string, body: string) => {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        to,
        from,
        body
      })
      .then(message => {
        resolve(message.sid);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const sendVerificationCode = (to: string) => {
  return new Promise((resolve, reject) => {
      client.verify.services(sid)
        .verifications
        .create({to: to, channel: 'sms'})
        .then(verification => {
          resolve(verification.status)
        })
        .catch(error => {
          reject(error);
        });
  });
};
export const verifyCode = (to: string, code: string) => {
  return new Promise((resolve, reject) => {
      client.verify.services(sid)
      .verificationChecks
      .create({to: to, code: code })
      .then(verification_check => {
        resolve(verification_check.status)
      })
      .catch(error => {
        reject(error);
      });
  });
};

