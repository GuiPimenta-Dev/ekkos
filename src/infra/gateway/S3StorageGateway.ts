import { S3Client } from "@aws-sdk/client-s3";
import StorageGatewayInterface from "../../application/infra/gateway/StorageGatewayInterface";
import crypto from "crypto";
import multerS3 from "multer-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export default class S3StorageGateway implements StorageGatewayInterface {
  upload() {
    return multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").at(-1);
        const newFileName = crypto.randomBytes(64).toString("hex");
        cb(null, `${newFileName}.${fileExtension}`);
      },
    });
  }
}
