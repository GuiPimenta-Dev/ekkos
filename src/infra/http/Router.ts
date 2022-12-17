import {
  updateCoords,
  uploadFile,
  verifyBand,
  verifyInvite,
  verifyRole,
  verifyToken,
  verifyUser,
  verifyVideo,
} from "../../application/middleware/Middlewares";

import BandController from "../../application/controller/BandController";
import ProfileController from "../../application/controller/ProfileController";
import UserController from "../../application/controller/UserController";
import VideoController from "../../application/controller/VideoController";
import ExpressAdapter from "./ExpressAdapter";
import FeedController from "../../application/controller/FeedController";

const app = ExpressAdapter.create();

app.post("/user/create", ExpressAdapter.route(UserController.create));
app.post("/user/login", ExpressAdapter.route(UserController.login));
app.post("/profile", verifyToken, uploadFile.single("avatar"), ExpressAdapter.route(ProfileController.create));
app.get("/profile/:id", verifyToken, verifyUser, updateCoords, ExpressAdapter.route(ProfileController.get));
app.post("/profile/:id/follow", verifyToken, verifyUser, ExpressAdapter.route(ProfileController.follow));
app.post("/profile/:id/unfollow", verifyToken, verifyUser, ExpressAdapter.route(ProfileController.unfollow));
app.post("/profile/match", verifyToken, verifyUser, updateCoords, ExpressAdapter.route(ProfileController.match));
app.post("/video", verifyToken, verifyUser, uploadFile.single("video"), ExpressAdapter.route(VideoController.post));
app.get("/video/:id", verifyToken, verifyUser, verifyVideo, ExpressAdapter.route(VideoController.get));
app.post("/video/:id/like", verifyToken, verifyUser, verifyVideo, ExpressAdapter.route(VideoController.like));
app.post("/video/:id/unlike", verifyToken, verifyUser, verifyVideo, ExpressAdapter.route(VideoController.unlike));
app.post("/video/:id/comment", verifyToken, verifyUser, verifyVideo, ExpressAdapter.route(VideoController.comment));
app.delete(
  "/video/:id/comment",
  verifyToken,
  verifyUser,
  verifyVideo,
  ExpressAdapter.route(VideoController.deleteComment)
);
app.post("/band", verifyToken, verifyUser, uploadFile.single("logo"), ExpressAdapter.route(BandController.create));
app.post(
  "/band/:id/invite",
  verifyToken,
  verifyUser,
  verifyBand,
  verifyRole,
  ExpressAdapter.route(BandController.inviteMember)
);
app.post(
  "/band/invite/:id/accept",
  verifyToken,
  verifyUser,
  verifyInvite,
  ExpressAdapter.route(BandController.acceptInvite)
);

app.post(
  "/band/invite/:id/decline",
  verifyToken,
  verifyUser,
  verifyInvite,
  ExpressAdapter.route(BandController.declineInvite)
);

app.get("/band/:id", verifyToken, verifyUser, verifyBand, ExpressAdapter.route(BandController.get));
app.post(
  "/band/:id/removeMember",
  verifyToken,
  verifyUser,
  verifyBand,
  ExpressAdapter.route(BandController.removeMember)
);

app.post(
  "/band/:id/openVacancy",
  verifyToken,
  verifyUser,
  verifyRole,
  ExpressAdapter.route(BandController.openVacancy)
);

app.get("/roles", verifyToken, verifyUser, ExpressAdapter.route(BandController.getRoles));
app.get("/feed", verifyToken, verifyUser, ExpressAdapter.route(FeedController.get));

export default app;
