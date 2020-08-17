import { Request, Response } from "express";
import { Controller, Post } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import { sendMessage, sendVerificationCode, verifyCode } from "../utils/twilio";

import { runQuery } from "../utils/dialogflow";
import { verifyIdentity } from "../models/database/functions"

import { User } from "../models/interfaces/user"

let dataUser : User = { 
  document:'',
  name: '',
  lastname: '',
  cellphone: '',
  email:'',
  status: 'inactivo'}

@Controller("api/bot")
export class BotController {
  @Post()
  private postMessage(request: Request, response: Response) {
    // Obtenemos el mensaje :Body, el numero desde el cual lo enviamos : To , y el número del cliente que lo recibira: From.
    const { Body, To, From } = request.body;
    let message: string;
    // Enviamos mensaje a dialogflow y esperamos que coincida con algun intento
    runQuery(Body, From)
      .then((result: any) => {
        // Twilio nos envia la respuesta de dialogflow
        switch (result.intent.displayName) {
          case "usuarioIngresaCodigo": {
            verifyCode(dataUser.cellphone,Body)
            .then((res) => {
              if (res === 'approved') {
                message = `Bienvenido(a) ${dataUser.name} 😊`;
              sendMessage(From, To, message)
              .then(res => {
                console.log('respuesta al usuario', res);
              })
              .catch(error => {
                console.error("ocurrió el siguiente error enviar código", error);
                Logger.Err(error);
              });
              }
              else {
                message = `Codigo de verificación incorrecto`;
                sendMessage(From, To, message)
                .then(res => {
                  console.log('respuesta al usuario', res);
                  
                })
                .catch(error => {
                  console.error("ocurrió el siguiente error enviar exito", error);
                  Logger.Err(error);
                });
              }
            })
            .catch(error => {
              console.error("ocurrió en error en verificar codigo", error);
              message = `Codigo de verificación incorrecto`;
              sendMessage(From, To, message)
              .then(res => {
                console.log('respuesta al usuario', res);
              })
              .catch(error => {
                console.error("ocurrió el siguiente error no enviar ", error);
                Logger.Err(error);
              });
            });
          }
          case "usuarioIngresaIdentificación": {
      
            if ( dataUser.status !== 'activo') {
              verifyIdentity(Body,To, From)
              .then((querySnapshot) => {
                if(querySnapshot.docs.length > 0) {
                  querySnapshot.forEach((doc: any) =>  {
                    dataUser.cellphone = doc.data().cellphone;
                    dataUser.status = 'activo';
                    message = `por favor ingrese el código de verificación enviado al número de celular registrado`;
                    sendMessage(From, To, message)
                    .then(res => {
                      console.log('respuesta al usuario', res);
                    })
                    .catch(error => {
                      console.error("ocurrió el siguiente error", error);
                      Logger.Err(error);
                    });
                    dataUser.cellphone = doc.data().cellphone;
                    dataUser.name = doc.data().name;
                    dataUser.status = 'activo';
                    sendVerificationCode(doc.data().cellphone)
                      .then((res) => {
                        console.log('se envio codigo por sms', res);
                      })
                      .catch(error => {
                        console.error("ocurrió en error en enviar el código", error);
                      });
                });
                }
                else {
                  message = `Lo sentimos, usted no se encuentra registrado`;
                  sendMessage(From, To, message)
                  .then(res => {
                    console.log('respuesta al usuario', res);
                  })
                  .catch(error => {
                    console.error("ocurrió el siguiente error", error);
                    Logger.Err(error);
                  });
                }
                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
              
            }
          }
            }
          
        sendMessage(From, To, result.fulfillmentText)
          .then(res => {
            console.log('respuesta al usuario', res);
          })
          .catch(error => {
            console.error("ocurrió el siguiente error", error);
            Logger.Err(error);
          });
      })
      .catch(error => {
        console.error("ocurrió el siguiente error", error);
        Logger.Err(error);
      });
    return response.status(200).send("SUCCESS");
  }
}
