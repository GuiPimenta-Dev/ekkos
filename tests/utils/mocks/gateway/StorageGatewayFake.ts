import StorageGatewayInterface from "../../../../src/application/ports/gateway/StorageGatewayInterface";
import crypto from "crypto";
import multer from "multer";

export default class StorageGatewayFake implements StorageGatewayInterface {
  upload() {
    return multer.diskStorage({
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);
          file.location = `${hash.toString("hex")}-${file.originalname}`;
          cb(null, file.location);
        });
      },
    });
  }
}
