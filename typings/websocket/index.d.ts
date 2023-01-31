import { WebSocket } from "ws";

/* @see https://stackoverflow.com/a/68641378/16334980 */
declare global {
  class CustomWebSocket extends WebSocket {
    isAlive: boolean;
  }
}
