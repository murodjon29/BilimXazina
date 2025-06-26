import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateBookDto } from "./dto/create.dto";
import { Brackets, DataSource, DeepPartial, getRepository, Repository } from "typeorm";
import { BookEntity } from "src/core/entitys/book.Entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "src/core/repository/book.repository";
import { FileService } from "../file/file.service";
import { ImagesEntity } from "src/core/entitys/images.Entity";
import { FilterBookDto } from "./dto/filter.dto";
import { Pager } from "src/infrastructure/lib/pagination";
import { UpdateBookDto } from "./dto/update.dto";


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
      if (files && files.length > 0) {
        const bookImages: ImagesEntity[] = []
        for (const file of files) {
            const imagePath = await this.fileService.createFile(file);
            const bookImage = queryRunner.manager.create(ImagesEntity, {
            image: imagePath,
          })
          await queryRunner.manager.save(bookImage);
          bookImages.push(bookImage);
        }
        book.images = bookImages
        await queryRunner.manager.save(book);
      }
      await queryRunner.commitTransaction()
      
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
      
      
      // const { search, author, page = 1, page_size = 10 } = filterDto;
      // const queryBuilder = this.bookRepo.createQueryBuilder('books')
      //   .leftJoinAndSelect('books.images', 'images');

      // if (search) {
      //   queryBuilder.andWhere(
      //     new Brackets((qb) => {
      //       qb.where('books.title ILIKE :search', { search: `%${search}%` })
      //         .orWhere('books.author ILIKE :search', { search: `%${search}%` })
      //         .orWhere('books.description ILIKE :search', { search: `%${search}%` });
      //     }),
      //   );
      // }

      // const take = +page_size;
      // const skip = (Math.max(+page, 1) - 1) * take;
      // const [data, count] = await queryBuilder
      //   .orderBy('books.created_at', 'DESC')
      //   .take(take)
      //   .skip(skip)
      //   .getManyAndCount();

      // const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
      // const filteredData = data.map((book) => {
      //   const images = (book.images || [])
      //     .filter((img: any) => {
      //       const ext = img.image.split('.').pop()?.toLowerCase();
      //       return imageExtensions.includes(ext);
      //     })
      //     .sort((a: any, b: any) => {
      //       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      //     });

      //   return {
      //     ...book,
      //     images: images.length ? [images[0]] : [],
      //   };
      // })

      // return Pager.of(filteredData, count, take, +page, 200, 'success');
      const book = await this.bookRepo.find({relations: ['images']})
      return {
        status_code: 200,
        messaege: 'success',
        data: book
      }
    } catch (error) {     
      throw new BadRequestException(`Error on fetching all books: ${error.message}`)
    }
  }

  async getBookById(id: number){
    try {
      const book = await this.getRepository.findOne({ where: { id }, relations: ['images'] });      
      if(!book) throw new NotFoundException(`Book with id ${id} not found`);
      if(book.image?.length){
        const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
        const isImage = (file: any) => {
          const lowerUrl = file.image.toLowerCase();
          return imageExtensions.some(ext => lowerUrl.endsWith(ext)) 
        }
        const images = book.images.filter(isImage);
        const  other = book.image.filter((img: any) => !isImage(img));
        book.images = [...images, ...other];
      }
      return {
        status_code: 200,
        message: 'Book fetched successfully',
        data: book
      }
    } catch (error) {
      throw new BadRequestException(`Error on fetching book with id ${id}: ${error.message}`)
    }
  }


  async updateBook(id: number, date: UpdateBookDto, files?: Express.Multer.File[]){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {      
      if (date.rating && date.rating > 5) throw new BadRequestException('Rating must be less than 5');
      if(date.quantity && date.quantity > 0) throw new BadRequestException('Quantity must be greater than 0');
      const book = await this.getRepository.findOne({ where: { id }, relations: ['images'] });
      if(!book) throw new NotFoundException(`Book with id ${id} not found`);
      if(!book.images) delete book.images;
      await queryRunner.manager.update(BookEntity, id, date);
      let bookImages: ImagesEntity[] = []
      if(files && files.length > 0) {
        const images = await queryRunner.manager.find(ImagesEntity, {
          where: { book: { id } }
        });
        for (const image of images){
          if(image.image && (await this.fileService.existsFile(image.image))){
            await this.fileService.deleteFile(image.image);
          }
          await queryRunner.manager.delete(ImagesEntity, image.id);
        }
        for(const file of files){
          const new_image = await this.fileService.createFile(file);
          const bookImage = queryRunner.manager.create(ImagesEntity, {
            image: new_image,
          });
          await queryRunner.manager.save(bookImage);
          bookImages.push(bookImage);
        }
      }
      book.images = bookImages;
      await queryRunner.manager.save(book);      
      await queryRunner.commitTransaction();
      const updateBook = await this.bookRepo.findOne({ where: { id }, relations: ['images'] });
      if(!updateBook) throw new NotFoundException(`Book with id ${id} not found after update`);
      return {
        status_code: 200,
        message: 'Book updated successfully',
        data: updateBook
      }
    } catch (error) {
      throw new BadRequestException(`Error on updating books: ${error.message}`)
      
    }
  }

  async deleteBook(id: number){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      
      const book = await this.getRepository.findOne({ where: { id }, relations: ['images'] });
      if(!book) throw new NotFoundException(`Book with id ${id} not found`);
      if(book.images && book.images.length > 0){
        for(const image of book.images){
          if(image.image && (await this.fileService.existsFile(image.image))){
            await this.fileService.deleteFile(image.image);
          }
          await queryRunner.manager.delete(ImagesEntity, image.id);
        }
      }
      await queryRunner.manager.delete(BookEntity, id);
      await queryRunner.commitTransaction();
      return {
        status_code: 200,
        message: 'Book deleted successfully',
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error on deleting book with id ${id}: ${error.message}`)
    } finally {
      await queryRunner.release();
    }
  }
}