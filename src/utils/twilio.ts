import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const sid = process.env.TWILIO_SMS_SID!;

const client = new Twilio(accountSid, authToken);

export const sendMessage = async (to: string, from: string, body: string) => {

  try {
    await client.messages.create({to,from,body})
  }
  catch(error) {
    throw Error(error);
  }
};

export const sendVerificationCode = async (to: string) => {
  try {
    await client.verify.services(sid)
    .verifications
    .create({to: to, channel: 'sms'})
  }
  catch(error) {
    throw Error(error);
  }
};
export const verifyCode = async (to: string, code: string) => {
  console.log(to, code);
  
  try{
    const result = await client.verify.services(sid)
          .verificationChecks
          .create({to: to, code: code })
    return result.status;
  }
  catch(error){
    throw Error(error);
  }
};

