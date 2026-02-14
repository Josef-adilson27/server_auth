import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/commmon/utils/is-dev-util';


@Module({
  imports: [  ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true, 
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
