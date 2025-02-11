import AWS from 'aws-sdk';

export class AWSApiConfigService {

  private readonly s3 = new AWS.S3();
    
  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    AWS.config.update({
      region: region,
      credentials: new AWS.Credentials({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      })
    });
  }

  public async fetchS3OutputConfigs (bucketName: string, bucketKey: string): Promise<any> {

    const callParams = {
      Bucket: bucketName,
      Key: bucketKey
    };

    try {
      const objeto = await this.s3.getObject(callParams).promise();
      const parsedObjeto = JSON.parse(objeto.Body?.toString() ?? "{}");
      return parsedObjeto.outputs;
    } catch (error:any) {
        console.error("Error fetching object: ", error, callParams);
    }

  }
}

