import { IsInt, IsOptional, IsString } from "class-validator";


export class FilterBookDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsInt()
    @IsOptional()
    page?: number;

    @IsInt()
    @IsOptional()
    page_size?: number;
}
