import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Request as ExpressRequest } from 'express'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

interface JwtUser {
    userId: number;
    role: string
}

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Get()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.reviewService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdateReviewDto,
        @Request() req: ExpressRequest & { user: JwtUser },
    ) {
        return this.reviewService.update(+id, dto, req.user.userId, req.user.role);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param('id') id: number,
        @Request() req: ExpressRequest & { user: JwtUser },
    ) {
        return this.reviewService.remove(+id, req.user.userId, req.user.role);
    }
}
