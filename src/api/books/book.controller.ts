
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  Get,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BookEntity } from 'src/core/entitys/book.Entity';
import { FilterBookDto } from './dto/filter.dto';
import { UpdateBookDto } from './dto/update.dto';

@ApiTags('Book api')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @ApiOperation({ summary: 'create book', description: 'Creates a new book with details and images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        rating: { type: 'number' },
        language: { type: 'string', enum: ['UZ', 'EN', 'RU'] },
        quantity: { type: 'number' },
        image: { type: 'array', items: { type: 'string', format: 'binary' } }, // image maydoni
      },
      required: ['title', 'author', 'price', 'image'],

      example: {
        title: 'Bilim Xazna',
        author: 'Bilim Xazna',
        description: 'Bilim Xazna kitobi haqida',
        price: 20000,
        rating: 4,
        language: 'UZ',
        quantity: 100,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to add a new book',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on creating book',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add a new book',
    type: BookEntity,
    schema: {
      example: {
        status_code: 201,
        message: 'Success',
        data: {
          id: 1,
          title: 'Bilim Xazna',
          author: 'Bilim Xazna',
          description: 'Bilim Xazna kitobi haqida',
          price: 20000,
          rating: 4,
          language: 'UZ',
          image: 'image1.jpg',
          quantity: 100,
          images: [{ id: 1, image: 'image1.jpg' }],
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images')) // images -> image
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto, @UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Kamida bitta rasm yuklanishi kerak');
    }
    return await this.bookService.createBook(createBookDto, files);
  }

  @ApiOperation({ summary: 'get all books', description: '' })
  @ApiQuery({ name: "author", required: false, description: 'Filter by author', example: 'Bilim Xazna' })
  @ApiQuery({ name: 'author', required: false, description: 'Filter by author', example: 'Bilim Xazna' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title, author, or description', example: 'Bilim' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'page_size', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of books retrieved successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Success',
        data: [
          {
            id: 1,
            title: 'Bilim Xazna',
            author: 'Bilim Xazna',
            description: 'Bilim Xazna kitobi haqida',
            price: 20000,
            rating: 4,
            language: 'UZ',
            image: 'image1.jpg',
            quantity: 100,
            images: [{ id: 1, image: 'image1.jpg' }],
          },
        ],
        total: 1,
        page: 1,
        page_size: 10,
      },
    },
  })
  @Get()
  async getAllBooks(@Query() filterDto: FilterBookDto) {
    return await this.bookService.getAllBooks(filterDto);
  }

  @ApiOperation({ summary: 'Get book by ID', description: 'Retrieves a book by its ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book retrieved successfully',
    type: BookEntity,
    schema: {
      example: {
        status_code: 200,
        message: 'Success',
        data: {
          id: 1,
          title: 'Bilim Xazna',
          author: 'Bilim Xazna',
          description: 'Bilim Xazna kitobi haqida',
          price: 20000,
          rating: 4,
          language: 'UZ',
          image: 'image1.jpg',
          quantity: 100,
          images: [{ id: 1, image: 'image1.jpg' }],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Book not found',
    schema: {
      example: {
        status_code: 404,
        message: 'Book with id 1 not found',
      },
    },
  })
  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return await this.bookService.getBookById(+id);
  }

  @ApiOperation({ summary: 'Update book', description: 'Updates an existing book by ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Book Title' },
        author: { type: 'string', example: 'Updated Book Author' },
        description: { type: 'string', example: 'Updated Book Description' },
        price: { type: 'number', example: 20000 },
        rating: { type: 'number', example: 4 },
        language: { type: 'string', example: 'UZ' },
        quantity: { type: 'number', example: 100 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book updated successfully',
    type: BookEntity,
    schema: {
      example: {
        status_code: 200,
        message: 'Success',
        data: {
          id: 1,
          title: 'Updated Book Title',
          author: 'Updated Book Author',
          description: 'Updated Book Description',
          price: 20000,
          rating: 4,
          language: 'UZ',
          quantity: 100,
          images: [{ id: 1, image: 'image1.jpg' }],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update book',
    schema: {
      example: {
        status_code: 400,
        message: 'Error on updating book',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.bookService.updateBook(+id, updateBookDto, files);
  }

  @ApiOperation({ summary: 'Delete book', description: 'Deletes a book by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book deleted successfully',
    schema: {
      example: {
        status_code: 200,
        message: 'Book deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Book not found',
    schema: {
      example: {
        status_code: 404,
        message: 'Book with id 1 not found',
      },
    },
  })
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return await this.bookService.deleteBook(+id);
  }

}
