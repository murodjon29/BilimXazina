import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/infrastructure/baseService';
import { CreateBookDto } from './dto/create.dto';
import { DeepPartial } from 'typeorm';
import { BookEntity } from 'src/core/entitys/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from 'src/core/repository/book.repository';

@Injectable()
export class BookService extends BaseService<
  CreateBookDto,
  DeepPartial<BookEntity>
> {
  constructor(@InjectRepository(BookEntity) repository: BookRepository) {
    super(repository);
  }
}
