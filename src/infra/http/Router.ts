import ExpressAdapter from "./ExpressAdapter";
import UserController from "../../application/controller/User";
import ProfileController from "../../application/controller/Profile";
import { verifyToken, verifyUser } from "../../application/middleware/Middlewares";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.createUser));
app.post("/user/login", ExpressAdapter.route(UserController.loginUser));
app.post("/profile", ExpressAdapter.route(verifyToken, ProfileController.createProfile));
app.get("/profile/:id", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.getProfile));

export default app;
