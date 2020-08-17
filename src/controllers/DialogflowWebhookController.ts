import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";

@Controller("api/webhook/dialogflow")
export class DialogflowWebhookController {
  @Post()
  private handleWebhook(request: Request, response: Response) {
    // Obtenemos resultados de dialogflow
    const { queryResult } = request.body;

    const { parameters } = queryResult;
    switch (queryResult.intent.displayName) {
  
      case "INTENTNAME": {
        const customParameter = parameters.mYCustomParameter;

        // Hacer algo aqui

        return response.status(200).send({
          fulfillmentMessages: [
            {
              text: {
                text: [`Respuesta al usuario en base a : ${customParameter}`],
              },
            },
          ],
          
        });
      }

      default: {
        return response.status(200).send();
      }
    }
  }
}
