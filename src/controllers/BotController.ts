import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { sendMessage, sendVerificationCode, verifyCode } from "../utils/twilio";

import { runQuery } from "../utils/dialogflow";
import { verifyIdentity } from "../models/database/functions"

import { User } from "../models/interfaces/user"

let user : User = { 
  document:'',
  name: '',
  lastname: '',
  cellphone: '',
  email:'',
  status: 'inactivo'}
@Controller("api/bot")
export class BotController {
  
  @Post()
  private async postMessage(request: Request, response: Response) {
      /* Obtenemos el mensaje :Body,
      El numero desde el cual lo enviamos : To ,
      El número del cliente que lo recibira: From. */
    const { Body, To, From } = request.body;
    let message = '';
    try {
      const dialogflow = await runQuery(Body, From)
      // Enviamos mensaje a dialogflow y esperamos que coincida con algun intento
      switch (dialogflow.intent.displayName) {

        case "usuarioIngresaIdentificación": {
          const { name, cellphone, status, document}  = await verifyIdentity(Body);
          user.name = name;
          user.cellphone = cellphone;
          user.status = status;
          user.document = document;
          console.log('CELLPHONE',cellphone);
          console.log('USER FULL',user);
            if (cellphone) {    
              message = `por favor ingrese el código de verificación enviado al número de celular registrado`; 
              await sendMessage(From, To, message);
              await sendVerificationCode(cellphone);
            }
            else {
              message = `Lo sentimos, usted no se encuentra registrado`;
              await sendMessage(From, To, message);
            }
          break;
        }
        case "usuarioIngresaCodigo": {
          console.log('CELLPHONEeeee', user.cellphone);
          console.log('Bodyyy',Body);
          
          const status = await verifyCode(user.cellphone, Body)
          if (status === 'approved') {
            message = `Bienvenido(a) ${user.name} 😊`;
            await sendMessage(From, To, message);
          }
          else {
            message = `Codigo de verificación incorrecto`;
            await sendMessage(From, To, message);
          }
          break;
        }
        default:
          await sendMessage(From, To, dialogflow.fulfillmentText);
            
      }
      return response.status(200)
    }
    catch(error){
      throw Error(error);
    }
  }
}
