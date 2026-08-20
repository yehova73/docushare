// actions/s3.ts
"use server";

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { randomUUID } from "crypto";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface GetUploadUrlParams {
  fileName: string;
  fileType: string;
  fileSize: number;
  key: string; // Optional key if you want to specify a custom S3 key
}

/**
 * Generates a presigned URL for uploading directly from the browser to S3.
 */
export async function getPresignedUploadUrl({
  fileName,
  fileType,
  key,
}: GetUploadUrlParams) {
  try {
    // Generate a unique S3 key to avoid filename collisions
    const fileExtension = fileName.split(".").pop();

    const uploadKey = `uploads/${key}/${fileName}.${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      ContentType: fileType,
    });

    // URL expires in 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return { success: true, uploadUrl, key: uploadKey };
  } catch (error) {
    console.error("Error generating presigned upload URL:", error);
    return { success: false, error: "Failed to generate upload URL" };
  }
}

/**
 * Generates a presigned URL for downloading/viewing a file from S3.
 */
export async function getPresignedDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(key.split("/").pop() || "file")}"`,
    });

    // URL expires in 1 hour (3600 seconds)
    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return { success: true, downloadUrl };
  } catch (error) {
    console.error("Error generating download URL:", error);
    return { success: false, error: "Failed to generate download URL" };
  }
}

/**
 * Deletes a file from S3.
 */
export async function deleteFileFromS3(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { success: false, error: "Failed to delete file from S3" };
  }
}
