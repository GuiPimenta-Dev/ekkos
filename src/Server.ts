import "dotenv/config";
import { createSocketIOChatGateway } from "./infra/gateway/SocketIOChatGateway";
import app from "./infra/http/Router";

const server = app.listen(3000);
export const io = createSocketIOChatGateway(server);
