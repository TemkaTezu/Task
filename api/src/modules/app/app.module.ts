import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurations from 'src/configurations';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '../aws/aws.module';
import { UserModule } from '../user/user.module';
import { SleepModule } from '../sleep/sleep.module';

@Module({
  imports: [
    SleepModule,
    AwsModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.CONNECTION_STRING,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
