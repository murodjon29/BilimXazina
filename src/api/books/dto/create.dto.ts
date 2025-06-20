import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'Book title',
    example: 'Bilim Xazna',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Book author',
    example: 'Bilim Xazna',
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    type: String,
    description: 'Book description',
    example: 'Bilim Xazna',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Book price',
    example: 20000,
  })
  @IsNotEmpty()
  @IsString()
  price: number;

  @ApiProperty({
    type: Number,
    description: 'Book rating',
    example: 4.5,
  })
  @IsNotEmpty()
  @IsString()
  rating: number;

  @ApiProperty({
    type: String,
    description: 'Book language',
    example: 'uz',
  })
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsOptional()
  image?: string;

  @ApiProperty({
    type: Number,
    description: 'Book quantity',
    example: 10,
  })
  @IsNotEmpty()
  @IsString()
  quantity: number;
}
