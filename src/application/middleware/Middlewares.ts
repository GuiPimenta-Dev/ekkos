import BadRequest from "../http/BadRequest";
import NotFound from "../http/NotFound";
import Unauthorized from "../http/Unauthorized";
import { config } from "../../Config";
import jwt from "jsonwebtoken";
import multer from "multer";
import Forbidden from "../http/Forbidden";
import { Status } from "../../dto/InviteDTO";

export async function verifyToken(req, res, next): Promise<void> {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new BadRequest("Authorization header is required");
    const token = authorization.split(" ")[1];
    if (!token) throw new Unauthorized("JWT token is required");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.headers.id = decoded.id;
      next();
    } catch (e: any) {
      throw new Unauthorized("Invalid token");
    }
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function verifyUser(req, res, next): Promise<void> {
  try {
    const { headers } = req;
    const user = await config.userRepository.findUserById(headers.id);
    if (!user) throw new NotFound("User not found");
    const profile = await config.profileRepository.findProfileById(headers.id);
    if (!profile) throw new NotFound("Profile not found");
    next();
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function verifyVideo(req, res, next): Promise<void> {
  try {
    const { params } = req;
    const video = await config.videoRepository.findVideoById(params.id);
    if (!video) throw new NotFound("Video not found");
    next();
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function verifyBand(req, res, next): Promise<void> {
  try {
    const { params } = req;
    const band = await config.bandRepository.findBandById(params.id);
    if (!band) throw new NotFound("Band not found");
    next();
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function verifyInvite(req, res, next): Promise<void> {
  try {
    const { params, headers } = req;
    const invite = await config.bandRepository.findInviteById(params.id);
    if (!invite) throw new NotFound("Invite not found");
    if (invite.status !== Status.pending) throw new BadRequest("Invite is not pending");
    if (invite.profileId !== headers.id) throw new Forbidden("Invite is not for this profile");
    next();
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function verifyRole(req, res, next): Promise<void> {
  try {
    const { body } = req;
    const roles = await config.bandRepository.findRoles();
    const isValid = roles.find((r) => r.role === body.role);
    if (!isValid) throw new BadRequest("Role is invalid");
    next();
  } catch (e: any) {
    res.status(e.statusCode).json({ message: e.message });
  }
}

export async function updateCoords(req, _, next): Promise<void> {
  const { headers } = req;
  const profile = await config.profileRepository.findProfileById(headers.id);
  profile.latitude = headers.latitude || profile.latitude;
  profile.longitude = headers.longitude || profile.longitude;
  await config.profileRepository.update(profile);
  next();
}

export const uploadFile = multer({
  storage: config.storage.upload(),
});
