import ExpressAdapter from "./ExpressAdapter";
import UserController from "../../application/controller/User";
import ProfileController from "../../application/controller/Profile";
import { verifyToken } from "../../application/middleware/Middlewares";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.createUser));
app.post("/user/login", ExpressAdapter.route(UserController.loginUser));
app.post("/profile", ExpressAdapter.route(verifyToken, ProfileController.createProfile));

export default app;
