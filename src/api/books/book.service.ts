import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateBookDto } from "./dto/create.dto";
import { Brackets, DataSource, DeepPartial, Repository } from "typeorm";
import { BookEntity } from "src/core/entitys/book.Entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "src/core/repository/book.repository";
import { FileService } from "../file/file.service";
import { ImagesEntity } from "src/core/entitys/images.Entity";
import { FilterBookDto } from "./dto/filter.dto";
import { Pager } from "src/infrastructure/lib/pagination";


@Injectable()
export class BookService extends BaseService<CreateBookDto, DeepPartial<BookEntity>> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: BookRepository,
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
    private readonly dataSource: DataSource,
    private readonly fileService: FileService
  ) {
    super(bookRepo);
  }

  async createBook(createBookDto: CreateBookDto, files?: Express.Multer.File[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (createBookDto.rating > 5) throw new BadRequestException('Rating must be less than 5');
      const book = queryRunner.manager.create(BookEntity, createBookDto);
      await queryRunner.manager.save(book)
      console.log(files);
      
      if (files && files.length > 0) {
        for (const file of files) {
          const imagePath = await this.fileService.createFile(file);
          const bookImage = queryRunner.manager.create(ImagesEntity, {
            image: imagePath,
            book: book
          })
          await queryRunner.manager.save(bookImage);
          await queryRunner.manager.update(BookEntity, book.id, { images: [bookImage] })
        }
      }
      await queryRunner.commitTransaction()
      console.log(await this.bookRepo.find({relations: ['images']}));
      
      console.log(await this.imagesRepository.find({relations: ['book']}));
      return {
        status_code: 201,
        message: 'success',
        data: book
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error on creating book: ${error}`)
    }
  }



  async getAllBooks(filterDto: FilterBookDto) {
    try {
      console.log(await this.bookRepo.find());
      
      
      const { search, author, page = 1, page_size = 10 } = filterDto;
      const queryBuilder = this.bookRepo.createQueryBuilder('book')
        .leftJoinAndSelect('book.images', 'images');

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('book.title ILIKE :search', { search: `%${search}%` })
              .orWhere('book.author ILIKE :search', { search: `%${search}%` })
              .orWhere('book.description ILIKE :search', { search: `%${search}%` });
          }),
        );
      }

      const take = +page_size;
      const skip = (Math.max(+page, 1) - 1) * take;
      const [data, count] = await queryBuilder
        .orderBy('book.created_at', 'DESC')
        .take(take)
        .skip(skip)
        .getManyAndCount();

      // Filtr qilish uchun, agar kerak bo‘lsa
      const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
      const filteredData = data.map((book) => {
        const images = (book.images || [])
          .filter((img: any) => {
            const ext = img.image.split('.').pop()?.toLowerCase();
            return imageExtensions.includes(ext);
          })
          .sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });

        return {
          ...book,
          images: images.length ? [images[0]] : [],
        };
      })

      return Pager.of(filteredData, count, take, +page, 200, 'success');
    } catch (error) {
      throw new BadRequestException(`Error on fetching all books: ${error.message}`)
    }
  }
}