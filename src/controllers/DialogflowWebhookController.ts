import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import { getBoletaByPeriode } from "../models/database/functions"
import { sendMessage, sendMessageMedia } from "../utils/twilio";

const storage = require('node-persist');
@Controller("api/webhook/dialogflow")
export class DialogflowWebhookController {
  @Post()
  private async handleWebhook(request: Request, response: Response) {
    // Obtenemos resultados de dialogflow
    const { queryResult } = request.body;
    const { parameters } = queryResult;
    let message = '';

    switch (queryResult.intent.displayName) {
  
      case "usuarioIngresaMes": {
        const { mes } = parameters;
        let { document } = await storage.getItem('user');
        let to  = await storage.getItem('to');
        let from = await storage.getItem('from');

        const link = await getBoletaByPeriode(mes, document);

        if (link) {    
          await sendMessageMedia(from, to, link);
        }
        else {
          message = `Lo sentimos, aún no contamos con la boleta correspondiente a ese mes`;
          await sendMessage(from, to, message);
        }
      }

      default: {
        return response.status(200).send();
      }
    }
  }
}
