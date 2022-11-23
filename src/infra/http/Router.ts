import ExpressAdapter from "./ExpressAdapter";
import UserController from "../../application/controller/User";
import ProfileController from "../../application/controller/Profile";
import { verifyToken, verifyUser } from "../../application/middleware/Middlewares";
import VideoController from "../../application/controller/Video";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", ExpressAdapter.route(verifyToken, ProfileController.create));
app.get("/profile/:id", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.get));
app.post("/profile/:id/follow", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.follow));
app.post("/profile/:id/unfollow", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.unfollow));
app.post("/video", ExpressAdapter.route(verifyToken, verifyUser, VideoController.post));
app.post("/video/:id/like", ExpressAdapter.route(verifyToken, verifyUser, VideoController.like));

export default app;
