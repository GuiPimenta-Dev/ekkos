import { uploadFile, verifyToken, verifyUser } from "../../application/middleware/Middlewares";

import BandController from "../../application/controller/Band";
import ProfileController from "../../application/controller/Profile";
import UserController from "../../application/controller/User";
import VideoController from "../../application/controller/Video";
import ExpressAdapter from "./ExpressAdapter";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", verifyToken, uploadFile.single("avatar"), ExpressAdapter.route(ProfileController.create));
app.get("/profile/:id", verifyToken, verifyUser, ExpressAdapter.route(ProfileController.get));
app.post("/profile/:id/follow", verifyToken, verifyUser, ExpressAdapter.route(ProfileController.follow));
app.post("/profile/:id/unfollow", verifyToken, verifyUser, ExpressAdapter.route(ProfileController.unfollow));
app.post("/video", verifyToken, verifyUser, uploadFile.single("video"), ExpressAdapter.route(VideoController.post));
app.get("/video/:id", verifyToken, verifyUser, ExpressAdapter.route(VideoController.get));
app.post("/video/:id/like", verifyToken, verifyUser, ExpressAdapter.route(VideoController.like));
app.post("/video/:id/unlike", verifyToken, verifyUser, ExpressAdapter.route(VideoController.unlike));
app.post("/video/:id/comment", verifyToken, verifyUser, ExpressAdapter.route(VideoController.comment));
app.delete("/video/:id/comment", verifyToken, verifyUser, ExpressAdapter.route(VideoController.deleteComment));
app.post("/band", verifyToken, verifyUser, uploadFile.single("logo"), ExpressAdapter.route(BandController.create));
app.post("/band/:id/addMember", verifyToken, verifyUser, ExpressAdapter.route(BandController.addMember));
app.get("/band/:id", verifyToken, verifyUser, ExpressAdapter.route(BandController.get));

export default app;
