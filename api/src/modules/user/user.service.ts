import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.schema';
import { AwsService } from '../aws/aws.service';
import { GetAllUsersResponse } from './response';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly awsService: AwsService
    ) { }

    async GetAllUsers(): Promise<GetAllUsersResponse[]> {
        const users = await this.userModel.find().exec();

        let response: GetAllUsersResponse[] = [];

        for (let i: number = 0; i < users.length; i++) {
            response[i] = {
                familyName: users[i].familyName,
                surename: users[i].surename,
                givenName: users[i].givenName,
                sex: users[i].sex,
                dateOfBirth: users[i].dateOfBirth,
                registrationNumber: users[i].registrationNumber,
                registrationNumberReq: users[i].registrationNumberReq,
                userImage: await this.awsService.GetImageFromS3(users[i].userImage.replace(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`, '')),
                ciImage: await this.awsService.GetImageFromS3(users[i].ciImage.replace(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`, '')),
                ciData: users[i].ciData
            };
        }

        return response;
    }

    async CreateUser(registrationNumber: string, userImage: Express.Multer.File, ciImage: Express.Multer.File): Promise<any> {
        const firstTwoChars = registrationNumber.substring(0, 2);
        if (!/^[А-Яа-я]{2}$/.test(firstTwoChars))
            throw new BadRequestException('Регистрийн дугаар буруу байна');

        const remainingChars = registrationNumber.substring(2);
        if (!/^\d+$/.test(remainingChars))
            throw new BadRequestException('Регистрийн дугаар буруу байна');

        const ciData = JSON.parse(await this.awsService.GetTextTextract(ciImage.buffer));

        if (!ciData || !ciData.Blocks || ciData.Blocks.length < 1 || !registrationNumber || !userImage || !ciImage)
            throw new BadRequestException('Иргэний үнэмлэхийн зураг буруу байна');

        let newUser = new this.userModel();

        newUser.registrationNumberReq = registrationNumber;

        for (let i = 0; i < ciData.Blocks.length; i++) {
            const block = ciData.Blocks[i];

            if (block.BlockType === 'LINE') {
                if (block.Text.includes('Family name')) {
                    if (ciData.Blocks[i + 2]?.Text.includes('Surname'))
                        newUser.familyName = ciData.Blocks[i + 1]?.Text;
                    else
                        newUser.familyName = ciData.Blocks[i + 2]?.Text;
                }

                if (block.Text.includes('Surname')) {
                    if (ciData.Blocks[i + 2]?.Text.includes('Given name'))
                        newUser.surename = ciData.Blocks[i + 1]?.Text;
                    else
                        newUser.surename = ciData.Blocks[i + 2]?.Text;
                }

                if (block.Text.includes('Given name')) {
                    if (ciData.Blocks[i + 2]?.Text.includes('Sex'))
                        newUser.givenName = ciData.Blocks[i + 1]?.Text;
                    else
                        newUser.givenName = ciData.Blocks[i + 2]?.Text;
                }

                if (block.Text.includes('Sex')) {
                    newUser.sex = (ciData.Blocks[i + 1]?.Text.split('/')[1] || '').trim();
                }

                if (block.Text.includes('Date of birth')) {
                    newUser.dateOfBirth = ciData.Blocks[i + 1]?.Text;
                }

                if (block.Text.includes('Registration number')) {
                    newUser.registrationNumber = (ciData.Blocks[i + 1]?.Text.split('/')[1] || '').trim();
                }
            }
        }

        newUser.ciData = JSON.stringify(ciData);

        if (!newUser.familyName || !newUser.surename || !newUser.givenName || !newUser.sex || !newUser.dateOfBirth || !newUser.registrationNumber || !newUser.ciData)
            throw new BadRequestException('Иргэний үнэмлэхийн зураг буруу байна');

        if (await this.userModel.findOne({ registrationNumber: newUser.registrationNumber }).exec())
            throw new BadRequestException('Хэрэглэгч бүртгэлтэй байна');

        const detectFaceUserImage = await this.awsService.DetectFacesRekognition(userImage.buffer);
        const detectFaceCIImage = await this.awsService.DetectFacesRekognition(ciImage.buffer);

        if (!detectFaceUserImage || !detectFaceUserImage.FaceDetails || detectFaceUserImage.FaceDetails.length !== 2 || detectFaceUserImage.FaceDetails[0].Confidence < 75 || detectFaceUserImage.FaceDetails[1].Confidence < 75)
            throw new BadRequestException('Иргэний үнэмлэхээ барьсан зураг буруу байна');

        if (!detectFaceCIImage || !detectFaceCIImage.FaceDetails || detectFaceCIImage.FaceDetails.length !== 1 || detectFaceCIImage.FaceDetails[0].Confidence < 75)
            throw new BadRequestException('Иргэний үнэмлэхийн зураг буруу байна');

        const compareFacesRekognitionResult = await this.awsService.CompareFacesRekognition(ciImage.buffer, userImage.buffer);

        if (!compareFacesRekognitionResult || !compareFacesRekognitionResult.FaceMatches || compareFacesRekognitionResult.FaceMatches.length !== 2 || compareFacesRekognitionResult.FaceMatches[0].Similarity < 90 || compareFacesRekognitionResult.FaceMatches[1].Similarity < 90)
            throw new BadRequestException('Хэрэглэгчийн нүүр иргэний үнэмлэхийн зурагтай таарахгүй байна');

        newUser.ciImage = await this.awsService.UploadImageToS3(ciImage, 'ci_' + newUser.registrationNumber);
        newUser.userImage = await this.awsService.UploadImageToS3(userImage, 'user_' + newUser.registrationNumber);
        const save = await newUser.save();

        if (save)
            return { statusCode: 200, message: 'OK' };
        else
            throw new BadRequestException('Хэрэглэгч бүртгэхэд алдаа гарла');
    }
}
