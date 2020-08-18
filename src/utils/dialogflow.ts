// dialogflow.ts

const dialogflow = require("dialogflow");
const credentials = require("../../credentials.json");

const sessionClient = new dialogflow.SessionsClient({
  credentials: credentials
});
const projectId: string = process.env.DIALOGFLOW_PROJECT_ID!;

export const runQuery = async (query: string, number: string) : Promise<any> => {
    try {
      // Identificador unico de sesión
      const sessionId = number;
      // Crear una nueva sesión
      const sessionPath = sessionClient.sessionPath(projectId, sessionId);
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            // query para enviar a dialogflow
            text: query,
            languageCode: "es-ES"
          }
        }
      };
      // Enviar request
      const responses = await sessionClient.detectIntent(request);
      const result = responses[0].queryResult;
      return result;
    } catch (error) {
      throw Error(error);
    }
};
