import { BadRequestException, Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetAllUsersResponse } from './response';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'userImage', maxCount: 1 },
        { name: 'ciImage', maxCount: 1 },
    ]))
    async createUser(@UploadedFiles() files: { userImage?: Express.Multer.File[], ciImage?: Express.Multer.File[] }, @Body('registrationNumber') registrationNumber: string) {
        const { userImage, ciImage } = files;

        if (!userImage?.[0] || !ciImage?.[0] || !registrationNumber) {
            throw new BadRequestException('The registrationNumber, ciImage, userImage required');
        }

        return this.userService.CreateUser(registrationNumber, userImage[0], ciImage[0]);
    }

    @Get('all')
    Login(): Promise<GetAllUsersResponse[]> {
        return this.userService.GetAllUsers();
    }
}
