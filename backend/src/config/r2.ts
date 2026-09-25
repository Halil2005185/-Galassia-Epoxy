import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (
  fileBuffer: Buffer,
  key: string,
  contentType?: string
) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      // Without this, R2 serves the object as application/octet-stream,
      // which browsers download instead of displaying inline.
      ContentType: contentType,
    })
  );

  return {
    key,
    // Spaces and other special characters in the original filename are
    // valid in an S3/R2 object key but break an unencoded URL (the browser
    // truncates at the first space) — encode each path segment, not the
    // "/" separators.
    url: `${process.env.R2_PUBLIC_URL}/${key.split("/").map(encodeURIComponent).join("/")}`,
  };
};
export const deleteFile = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  );
};