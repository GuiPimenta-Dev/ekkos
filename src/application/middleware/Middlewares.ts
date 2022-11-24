import jwt from "jsonwebtoken";
import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import BadRequest from "../http/BadRequest";
import Forbidden from "../http/Forbidden";
import NotFound from "../http/NotFound";
import Unauthorized from "../http/Unauthorized";

export async function verifyToken(input: InputDTO): Promise<void> {
  const { authorization } = input.headers;
  if (!authorization) throw new BadRequest("Authorization header is required");
  const token = authorization.split(" ")[1];
  if (!token) throw new Forbidden("JWT token is required");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    input.headers.id = decoded.id;
  } catch (e: any) {
    throw new Unauthorized("Invalid token");
  }
}

export async function verifyUser(input: InputDTO): Promise<void> {
  const { headers } = input;
  const user = await config.userRepository.findUserById(headers.id);
  if (!user) throw new NotFound("User not found");
}
