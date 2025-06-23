import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
