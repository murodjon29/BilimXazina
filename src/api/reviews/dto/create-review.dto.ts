import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({
        type: Number,
        description: 'User ID',
        example: 1
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        type: Number,
        description: 'Rating',
        example: 5
    })
    @IsNumber()
    rating: number;

    @ApiProperty({
        type: String,
        description: 'Comment',
        example: 'Good book'
    })
    @IsString()
    @IsOptional()
    comment: string;

    @ApiProperty({
        type: Number,
        description: 'Book ID',
        example: 1
    })
    @IsNumber()
    bookId: number;

}