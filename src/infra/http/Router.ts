import ExpressAdapter from "./ExpressAdapter";
import UserController from "../../application/controller/User";
import ProfileController from "../../application/controller/Profile";
import { verifyToken, verifyUser } from "../../application/middleware/Middlewares";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", ExpressAdapter.route(verifyToken, ProfileController.create));
app.get("/profile/:id", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.get));
app.post("/profile/:id/follow", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.follow));

export default app;
