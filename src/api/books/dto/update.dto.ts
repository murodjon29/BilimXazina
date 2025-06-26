import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create.dto';
import { IsOptional } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
