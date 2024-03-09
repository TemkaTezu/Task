import { Controller, Get } from '@nestjs/common';
import { SleepService } from './sleep.service';

@Controller('sleep')
export class SleepController {
    constructor(private readonly sleepService: SleepService) { }

    @Get()
    Sleep(): Promise<any> {
        return this.sleepService.Sleep();
    }
}
