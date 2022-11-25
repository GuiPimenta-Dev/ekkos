import { uploadFile, verifyToken, verifyUser } from "../../application/middleware/Middlewares";

import ExpressAdapter from "./ExpressAdapter";
import ProfileController from "../../application/controller/Profile";
import UserController from "../../application/controller/User";
import VideoController from "../../application/controller/Video";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", ExpressAdapter.route(verifyToken, ProfileController.create));
app.get("/profile/:id", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.get));
app.post("/profile/:id/follow", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.follow));
app.post("/profile/:id/unfollow", ExpressAdapter.route(verifyToken, verifyUser, ProfileController.unfollow));
// app.post(
//   "/video",
//   multer(multerConfig).single("file"),
//   ExpressAdapter.route(verifyToken, verifyUser, VideoController.post)
// );
app.post("/video", uploadFile.single("file"), ExpressAdapter.route(verifyToken, verifyUser, VideoController.post));
app.get("/video/:id", ExpressAdapter.route(verifyToken, verifyUser, VideoController.get));
app.post("/video/:id/like", ExpressAdapter.route(verifyToken, verifyUser, VideoController.like));
app.post("/video/:id/unlike", ExpressAdapter.route(verifyToken, verifyUser, VideoController.unlike));
app.post("/video/:id/comment", ExpressAdapter.route(verifyToken, verifyUser, VideoController.comment));
app.delete("/video/:id/comment", ExpressAdapter.route(verifyToken, verifyUser, VideoController.deleteComment));
export default app;
