import jwt from "jsonwebtoken";
import InputDTO from "../../dto/InputDTO";
import HttpError from "../error/HttpError";

export function verifyToken(input: InputDTO): void {
  const { authorization } = input.headers;
  if (!authorization) throw new HttpError(400, "Authorization header is required");
  const token = authorization.split(" ")[1];
  if (!token) throw new HttpError(401, "jwt token is required");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    input.headers.id = decoded.id;
  } catch (e) {
    throw new HttpError(401, "Invalid token");
  }
}
