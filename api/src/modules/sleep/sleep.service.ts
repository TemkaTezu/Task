import { Injectable } from '@nestjs/common';

@Injectable()
export class SleepService {
    async Sleep(): Promise<any> {
        await this.sleep(3);
        return { statusCode: 200, message: 'OK' };
    }

    async sleep(seconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}
