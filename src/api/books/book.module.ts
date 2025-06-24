import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/core/entitys/book.Entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { FileService } from '../file/file.service';
import { ImagesEntity } from 'src/core/entitys/images.Entity';
import { FileModule } from '../file/file..module';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, ImagesEntity]), FileModule],
  controllers: [BookController],
  providers: [BookService, FileService],
})
export class BookModule {}
