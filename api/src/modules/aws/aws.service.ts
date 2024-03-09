import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import axios from 'axios';

@Injectable()
export class AwsService {
    private readonly textract: AWS.Textract;
    private rekognition: AWS.Rekognition;

    constructor() {
        this.textract = new AWS.Textract({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        this.rekognition = new AWS.Rekognition();
    }

    async GetTextTextract(image: Buffer): Promise<any> {
        const params: AWS.Textract.DetectDocumentTextRequest = {
            Document: {
                Bytes: image,
            },
        };

        const result = await this.textract.detectDocumentText(params).promise();
        return JSON.stringify(result);
    }

    async UploadImageToS3(imageFile: Express.Multer.File, id: string): Promise<string> {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `users/${id}`,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
            ACL: 'private'
        };

        const data = await s3.upload(params).promise();
        return data.Location;
    }

    async GetImageFromS3(objectKey: string): Promise<Buffer> {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        const signedUrlParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: objectKey,
            Expires: 300
        };

        const signedUrl = await s3.getSignedUrlPromise('getObject', signedUrlParams);

        const axios = require('axios');

        const response = await axios.get(signedUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    }

    async DetectFacesRekognition(image: Buffer): Promise<any> {
        const params = {
            Image: {
                Bytes: image,
            },
        };

        const response = await this.rekognition.detectFaces(params).promise();
        return response;
    }

    async CompareFacesRekognition(image1: Buffer, image2: Buffer): Promise<any> {
        const params = {
            SourceImage: {
                Bytes: image1,
            },
            TargetImage: {
                Bytes: image2,
            },
        };

        const response = await this.rekognition.compareFaces(params).promise();
        return response;
    }
}
