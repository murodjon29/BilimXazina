import { Repository } from 'typeorm';
import { BookEntity } from '../entitys/book.Entity';

export class BookRepository extends Repository<BookEntity> {}
