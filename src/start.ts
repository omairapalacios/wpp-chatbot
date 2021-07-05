import { config } from "dotenv";
config();
import { AppServer } from "./AppServer";
// Instancia un nuevo servidor y llama al metodo start para levantarlo
const appServer = new AppServer();
appServer.start(5000);
