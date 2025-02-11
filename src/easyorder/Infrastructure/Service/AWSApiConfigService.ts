import {  GetObjectCommand, NoSuchKey, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";

export class AWSApiConfigService {
  private readonly s3: S3Client;

  constructor(region: string, accessKeyId: string, secretAccessKey: string, sessionToken: string) {
    const credentials: AwsCredentialIdentity = {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken
    };
    this.s3 = new S3Client({
      region: region,
      credentials: credentials
    });
  }

  public async fetchS3OutputConfigs(bucketName: string, key: string): Promise<any> {

    try {
      const response = await this.s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      );
      
      const str = await response.Body?.transformToString();
      if (!str) {
        throw new Error(`Failed to fetch object body from S3 for key: ${key}`);
      }
      
      const parsed = JSON.parse(str);
      return parsed.outputs;
      
    } catch (caught) {
      if (caught instanceof NoSuchKey) {
        console.error(
          `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`,
        );
      } else if (caught instanceof S3ServiceException) {
        console.error(
          `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
        );
      } else {
        throw caught;
      }
    }
  }
}

