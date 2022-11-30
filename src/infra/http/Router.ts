import {
  updateCoords,
  uploadFile,
  verifyBand,
  verifyInvite,
  verifyToken,
  verifyUser,
  verifyVideo,
} from "../../application/middleware/Middlewares";

import BandController from "../../application/controller/Band";
import ProfileController from "../../application/controller/Profile";
import UserController from "../../application/controller/User";
import VideoController from "../../application/controller/Video";
import ExpressAdapter from "./ExpressAdapter";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", verifyToken, uploadFile.single("avatar"), ExpressAdapter.route(ProfileController.create));
app.get("/profile/:id", verifyToken, verifyUser, updateCoords, ExpressAdapter.route(ProfileController.get));
app.post("/profile/:id/follow", verifyToken, verifyUser, updateCoords, ExpressAdapter.route(ProfileController.follow));
app.post(
  "/profile/:id/unfollow",
  verifyToken,
  verifyUser,
  updateCoords,
  ExpressAdapter.route(ProfileController.unfollow)
);
app.post("/profile/match", verifyToken, verifyUser, updateCoords, ExpressAdapter.route(ProfileController.match));
app.post(
  "/video",
  verifyToken,
  verifyUser,
  updateCoords,
  uploadFile.single("video"),
  ExpressAdapter.route(VideoController.post)
);
app.get("/video/:id", verifyToken, verifyUser, verifyVideo, updateCoords, ExpressAdapter.route(VideoController.get));
app.post(
  "/video/:id/like",
  verifyToken,
  verifyUser,
  verifyVideo,
  updateCoords,
  ExpressAdapter.route(VideoController.like)
);
app.post(
  "/video/:id/unlike",
  verifyToken,
  verifyUser,
  verifyVideo,
  updateCoords,
  ExpressAdapter.route(VideoController.unlike)
);
app.post(
  "/video/:id/comment",
  verifyToken,
  verifyUser,
  verifyVideo,
  updateCoords,
  ExpressAdapter.route(VideoController.comment)
);
app.delete(
  "/video/:id/comment",
  verifyToken,
  verifyUser,
  updateCoords,
  ExpressAdapter.route(VideoController.deleteComment)
);
app.post(
  "/band",
  verifyToken,
  verifyUser,
  updateCoords,
  uploadFile.single("logo"),
  ExpressAdapter.route(BandController.create)
);
app.post(
  "/band/:id/invite",
  verifyToken,
  verifyUser,
  verifyBand,
  updateCoords,
  ExpressAdapter.route(BandController.inviteMember)
);
app.post(
  "/band/:id/invite/accept",
  verifyToken,
  verifyUser,
  verifyInvite,
  updateCoords,
  ExpressAdapter.route(BandController.acceptInvite)
);

app.post(
  "/band/:id/invite/decline",
  verifyToken,
  verifyUser,
  verifyInvite,
  updateCoords,
  ExpressAdapter.route(BandController.declineInvite)
);

app.get("/band/:id", verifyToken, verifyUser, verifyBand, updateCoords, ExpressAdapter.route(BandController.get));
app.post(
  "/band/:id/removeMember",
  verifyToken,
  verifyUser,
  verifyBand,
  updateCoords,
  ExpressAdapter.route(BandController.removeMember)
);

export default app;
