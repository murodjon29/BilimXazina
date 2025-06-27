import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({
        type: Number,
        description: 'Quantity of the book',
        example: 2,
    })
    @IsOptional()
    @IsInt()
    book_quantity: number;

    @ApiProperty({
        type: String,
        description: 'Description of the order',
        example: 'Order for 2 books',
    })
    @IsOptional()
    @IsString()
    description: string;


    @ApiProperty({
        type: String,
        description: 'Status of the order',
        example: 'pending',
    })
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty({
        type: Number,
        description: 'Total price of the order',
        example: 40000,
    })
    @IsNotEmpty()
    @IsInt()
    total_price: number;
    
    @ApiProperty({
        type: Number,
        description: 'ID of the book associated with the order',
        example: 1,
    })
    @IsNotEmpty()
    @IsInt()
    book_id: number;
}