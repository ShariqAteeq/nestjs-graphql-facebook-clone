import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BootstrapModule } from './setup/bootstrap.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    BootstrapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
