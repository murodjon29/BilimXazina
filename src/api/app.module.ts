import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { BookModule } from './books/book.module';
import { FileModule } from './file/file..module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URL,
      entities: [__dirname +'dist/core/entity/.entity{.js,.ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'base'),
      serveRoot: 'api/v1/base',
    }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({ global: true }),
    // AdminModule kabi modullar chaqirilihs kerak!!!!!!!!!=======>
    BookModule,
    FileModule
  ],
})
export class AppModule {}
