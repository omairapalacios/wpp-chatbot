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
    console.log('aqui autherror linea 14 tw', error);
    
    throw Error(error);
  }
};

export const sendMessageMedia = async (to: string, from: string, mediaUrl: string) => {
console.log('Media url', mediaUrl);

  try {
    await client.messages.create({to,from,body:"boleta-konecta", mediaUrl})
  }
  catch(error) {
    throw Error(error);
  }
};

export const sendVerificationCode = async (to: string) => {
  try {
    const result = await client.verify.services(sid)
    .verifications
    .create({to: to, channel: 'sms'})
    console.log('result de enviar codigo',result);
  }
  catch(error) {
    throw Error(error);
  }
};
export const verifyCode = async (to: string, code: string) => {
  try{
    const result = await client.verify.services(sid)
          .verificationChecks
          .create({to: to, code: code })
    console.log('result de verificar codigo',result);
    
    return result.status;
  }
  catch(error){
    console.log('error al verificar codigo linea 48 tw', error);
    
    throw Error(error);
  }
};
