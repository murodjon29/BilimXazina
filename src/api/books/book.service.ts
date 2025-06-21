import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/infrastructure/lib/baseService/index';
import { CreateBookDto } from './dto/create.dto';
import { DeepPartial } from 'typeorm';
import { BookEntity } from 'src/core/entitys/book.Entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from 'src/core/repository/book.repository';
import { FileService } from '../file/file.service';

@Injectable()
export class BookService extends BaseService<
  CreateBookDto,
  DeepPartial<BookEntity>
> {
  constructor(
    @InjectRepository(BookEntity) repository: BookRepository,
    private readonly fileService: FileService,
  ) {
    super(repository);
  }

  async createBook(createBookDto: CreateBookDto, file?: Express.Multer.File | any) {
    let photo = '';
    if (file) {
      photo = await this.fileService.createFile(file);
    }
    const {title, quantity, author, language} = createBookDto
    const book = await this.getRepository.findOne({where: {title}}) 
    if(book) throw new ConflictException('Logib already exists');
    try {
      let newBook = await this.getRepository.create({
        ...createBookDto,
        photo
      });
      newBook = await this.getRepository.save(newBook)
    } catch (error) {
      throw new BadRequestException(`Error on creating book: ${error}`);
    }
    return {
      status_code: 201,
      message: 'success',
      data: {} 
    }
  }
}
