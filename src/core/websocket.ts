import { Server, IncomingMessage, ServerResponse } from "http";
import WebSocket, { WebSocketServer } from "ws";

interface CreateWebSocketServer {
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
}

/**
 * Attach websockets to Express server
 */
export const createWebSocketServer = ({
  server,
}: CreateWebSocketServer): WebSocket.Server<WebSocket.WebSocket> => {
  /* ######################################## */
  /* Initialise the websocket server instance */
  /* ######################################## */
  const wss = new WebSocketServer({ server });

  /* ######################################## */
  /* On connection */
  /* ######################################## */
  wss.on("connection", (ws: CustomWebSocket) => {
    ws.isAlive = true;

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    /* Send a message to the client on connect */
    ws.send(
      JSON.stringify({
        event: "onConnect",
        payload: "Hi there, I am a WebSocket server",
      }),
    );
  });

  /* ######################################## */
  /* Initialise the websocket server instance */
  /* ######################################## */
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const customWs = ws as CustomWebSocket;
      if (customWs.isAlive === false) {
        return ws.terminate();
      }

      customWs.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  return wss;
};
