import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import Languages from 'src/common/enum/language';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'Book title',
    example: 'Bilim Xazna',
  })
  // @IsInt()
  // @IsNotEmpty()
  // id: number

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
  @IsEnum(Languages)
  language: Languages = Languages.UZ;


  @ApiProperty({
    type: Number,
    description: 'Book quantity',
    example: 10,
  })
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    type: Number,
    description: 'Book barcode',
    example: 1234567890,
  })
  @IsOptional()
  barcode?: number;
}
