import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "src/infrastructure/lib/baseService";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { DeepPartial } from "typeorm";
import { UpdateBookDto } from "../books/dto/update.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "src/core/entitys/order.Entity";
import { OrderRepository } from "src/core/repository/order.repository";
import { BookRepository } from "src/core/repository/book.repository";
import { BookEntity } from "src/core/entitys/book.Entity";
import { UpdateOrderDto } from "./dto/updateOrder.dto";

@Injectable()
export class OrderService extends BaseService<CreateOrderDto, DeepPartial<UpdateBookDto>> {
    constructor(@InjectRepository(OrderEntity) private readonly orderRepo: OrderRepository,
        @InjectRepository(BookEntity) private readonly bookRepo: BookRepository
    ) {
        super(orderRepo);
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        try {
            const book = await this.bookRepo.findOneBy({ id: createOrderDto.book_id });
            if(!book) throw new BadRequestException('Book not found');
            if(createOrderDto.book_quantity < book.quantity) {
                throw new BadRequestException('Not enough quantity available');
            }
            if(createOrderDto.book_quantity && createOrderDto.book_quantity === 0) createOrderDto.book_quantity = 1;
            const order = this.orderRepo.create({...createOrderDto, book});
            await this.orderRepo.save(order);
            const newOrder = await this.orderRepo.findOne({
                where: { id: order.id },
                relations: ['book']
            });
            return {
                status_code: 201,
                message: 'Order created successfully',
                data: newOrder
            }

        } catch (error) {
            throw new BadRequestException(`Error on creating book: ${error}`)
        }
    }

    async getOrders() {
        try {
            const oders = await this.orderRepo.find({
                relations: ['book'],
                order: { createdAt: 'DESC' }});
            if (!oders || oders.length === 0) {
                return {
                    status_code: 404,
                    message: 'No orders found',
                    data: []
                };
            }
            return {
                status_code: 200,
                message: 'Orders retrieved successfully',
                data: oders
            };
        } catch (error) {
            throw new BadRequestException(`Error on getting orders: ${error}`);
        }
    }

    async getOrderById(id: number) {
        try {
            const order = await this.orderRepo.findOne({
                where: { id },
                relations: ['book']
            });
            if (!order) {
                throw new BadRequestException(`Order with id ${id} not found`);
            }
            return {
                status_code: 200,
                message: 'Order retrieved successfully',
                data: order
            };
        } catch (error) {
            throw new BadRequestException(`Error on getting order by id: ${error}`);
        }
    }

    async updateOrder(id: number, data: UpdateOrderDto ){
        try {
            if(!await this.orderRepo.findOneBy({id})) throw new BadRequestException(`Order with id ${id} not found`);
            const book = await this.bookRepo.findOneBy({ id: data.book_id });
            if(!book) throw new BadRequestException('Book not found');
            await this.orderRepo.update(id, { ...data, book });
            const updatedOrder = await this.orderRepo.findOne({
                where: { id },
                relations: ['book']
            });
            if (!updatedOrder) {
                throw new BadRequestException(`Order with id ${id} not found after update`);
            }
            return {
                status_code: 200,
                message: 'Order updated successfully',
                data: updatedOrder
            };
        } catch (error) {
            throw new BadRequestException(`Error on updating order: ${error}`);
        }
    }

    async deleteOrder(id: number) {
        try {
            const order = await this.orderRepo.findOneBy({ id });
            if (!order) {
                throw new BadRequestException(`Order with id ${id} not found`);
            }
            await this.orderRepo.delete(id);
            return {
                status_code: 200,
                message: 'Order deleted successfully',
                data: null
            };
        } catch (error) {
            throw new BadRequestException(`Error on deleting order: ${error}`);
        }
    }
}