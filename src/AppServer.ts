import * as express from "express";
import * as controllers from "./controllers";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import * as cors from "cors";

export class AppServer extends Server {
  private readonly SERVER_STARTED = "Servidor escuchando en el puerto: ";
  // Inicializa las propiedades de la clase padre y propias
  constructor() {
    super(true);
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.setupControllers();
  }
  // Levanta y agrega controladores importandos en index.js
  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
  }
  // Levanta el servidor
  public start(port: number): void {
    this.app.get("*", (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}
