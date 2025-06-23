import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    rating: number;

    @IsString()
    comment: string;

    @IsNumber()
    bookId: number;

    @IsOptional()
    createdAt?: Date;
}