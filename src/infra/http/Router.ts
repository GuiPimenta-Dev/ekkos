import ExpressAdapter from "./ExpressAdapter";
import UserController from "../../application/controller/User";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.createUser));
app.post("/user/login", ExpressAdapter.route(UserController.loginUser));

export default app;
