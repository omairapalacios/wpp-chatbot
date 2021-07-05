import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import { getBoletaByPeriod } from "../models/database/functions"
import { sendMessage, sendMessageMedia } from "../utils/twilio";

const storage = require('node-persist');
@Controller("api/webhook/dialogflow")
export class DialogflowWebhookController {
  @Post()
  private async handleWebhook(request: Request, response: Response) {
    // Obtenemos resultados de dialogflow
    const { queryResult } = request.body;
    const { parameters, queryText } = queryResult;
    let message = '';
    let link = '';
    let to  = await storage.getItem('to');
    let from = await storage.getItem('from');
    let user = await storage.getItem('user');
    if(user){
      switch (queryResult.intent.displayName) {
        case "usuarioIngresaMes": {
          const { mes } = parameters;
          let { document } = await storage.getItem('user');
          message = `Buscaré tu boleta del mes ${queryText} 😉.Dame un momento por favor ⏳ ...`
          await sendMessage(from, to, message);
          link = await getBoletaByPeriod(mes, document);
          if (link !== '') {    
            await sendMessageMedia(from, to, link);
          }
          else {
            message = `Lo siento, aún no contamos con la boleta correspondiente a ese mes`;
            await sendMessage(from, to, message);
          }
        }
        default: {
          return response.status(200).send();
        }
      }

    }
    else {
      message = `No has iniciado sesión o tu sesión a finalizado. Por favor ingresa tu documento de identidad para poder ayudarte 😉`;
      await sendMessage(from, to, message);
    }
    
  }
}
