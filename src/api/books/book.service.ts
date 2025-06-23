import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateBookDto } from "./dto/create.dto";
import { Brackets, DataSource, DeepPartial } from "typeorm";
import { BookEntity } from "src/core/entitys/book.Entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "src/core/repository/book.repository";
import { FileService } from "../file/file.service";
import { ImagesEntity } from "src/core/entitys/images.Entity";
import { FilterBookDto } from "./dto/filter.dto";
import { Pager } from "src/infrastructure/lib/pagination";


@Injectable()
export class BookService extends BaseService<CreateBookDto, DeepPartial<BookEntity>>  {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: BookRepository,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService
  ) {
     super(bookRepository);
  }

  async createBook(createBookDto: CreateBookDto, files?: Express.Multer.File[]){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let book =  queryRunner.manager.create(BookEntity, {
        ...createBookDto,
        image: (files && files.length > 0) ? '' : createBookDto.image
      })
      book = await queryRunner.manager.save(book)
      
      if(files && files.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            const imageUrl = await this.fileService.createFile(file);
            const bookImage = queryRunner.manager.create(ImagesEntity, {
              image: imageUrl,
              book
            });
            return queryRunner.manager.save(bookImage);
          })
        );
        book.image = files[0] ? await this.fileService.createFile(files[0]) : '';
        await queryRunner.manager.update(BookEntity, book.hasId, {image: book.image})
      } 
      await queryRunner.commitTransaction();
      return {
        status_code: 201,
        messaeg: 'success',
        data: book
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error on creating book: ${error}`)
    } finally {
      await queryRunner.release();
    }
  }

  async getAllBooks(filterDto: FilterBookDto){
    try {
      const {search, author, page = 1, page_size = 10} = filterDto;
      const queryBuilder = this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.images', 'images')
      .where('1 = 1')

      if(search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('book.title ILIKE :search', { search: `%${search}%` })
            .orWhere('book.author ILIKE :search', { search: `%${search}%` }) 
            .orWhere('book.description ILIKE :search', { search: `%${search}%` })
          })
        )
      }
      if(author) {
        queryBuilder.andWhere('book.author ILIKE :author', { author: `%${author}%` })        
      }
      const take = +page_size;
      const skip = (Math.max(+page, 1) - 1) * take
      const [data, count] = await queryBuilder
      .orderBy('book.created_at', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();
      return Pager.of(data, count, take, +page, 200, 'success');
    } catch (error) {
      throw new BadRequestException(`Error on getting books: ${error}`)
    }
  }
}