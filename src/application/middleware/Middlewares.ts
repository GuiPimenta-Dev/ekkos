import jwt from "jsonwebtoken";
import InputDTO from "../../dto/InputDTO";
import HttpError from "../error/HttpError";
import { config } from "../../Config";

export async function verifyToken(input: InputDTO): Promise<void> {
  const { authorization } = input.headers;
  if (!authorization) throw new HttpError(400, "Authorization header is required");
  const token = authorization.split(" ")[1];
  if (!token) throw new HttpError(401, "jwt token is required");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    input.headers.id = decoded.id;
  } catch (e: any) {
    throw new HttpError(401, "Invalid token");
  }
}

export async function verifyUser(input: InputDTO): Promise<void> {
  const { headers } = input;
  const user = await config.userRepository.findUserById(headers.id);
  if (!user) throw new HttpError(401, "User not found");
}
