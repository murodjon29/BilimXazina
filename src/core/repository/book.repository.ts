import { Repository } from 'typeorm';
import { BookEntity } from '../entitys/book.entity';

export class BookRepository extends Repository<BookEntity> {}
