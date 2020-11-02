import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const sid = process.env.TWILIO_SMS_SID!;

const client = new Twilio(accountSid, authToken);

export async function sendMessage (to: string, from: string, body: string) {

  try {
    await client.messages.create({to,from,body})
  }
  catch(error) {
    console.log('Error sendMessage', error);   
    throw Error(error);
  }
};

export async function sendMessageMedia (to: string, from: string, mediaUrl: string) {
console.log('Media URL', mediaUrl);
  try {
    await client.messages.create({to,from,body:"boleta-konecta", mediaUrl})
  }
  catch(error) {
    throw Error(error);
  }
};

export async function sendVerificationCode (to: string) {
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
export async function verifyCode(to: string, code: string) {
  try{
    const result = await client.verify.services(sid)
          .verificationChecks
          .create({to: to, code: code })
    console.log('se verificó codigo',result);
    
    return result.status;
  }
  catch(error){
    console.log('error al verificar codigo', error);
    
    throw Error(error);
  }
};
