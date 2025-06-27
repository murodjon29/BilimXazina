import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { UpdateOrderDto } from "./dto/updateOrder.dto";


@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @ApiOperation({ summary: 'Create a new order' })
    @ApiConsumes('application/json')
    @ApiResponse({
        status: 201,
        description: 'Order created successfully',
        schema: {
            example: {
                status_code: 201,
                message: 'Order created successfully',
                data: {
                    id: 1,
                    book_id: 1,
                    book_quantity: 2,
                    user_id: 1,
                    createdAt: '2023-10-01T00:00:00Z',
                    updatedAt: '2023-10-01T00:00:00Z',
                    book: {
                        id: 1,
                        title: 'Bilim Xazna',
                        author: 'Bilim Xazna',
                        description: 'Bilim Xazna kitobi haqida',
                        price: 20000,
                        rating: 4,
                        language: 'UZ',
                        quantity: 100,
                        image: ['image1.jpg', 'image2.jpg'],
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request, invalid input data',
        schema: {
            example: {
                status_code: 400,
                message: 'Error on creating order: Book not found or not enough quantity available',
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Book not found',
        schema: {
            example: {
                status_code: 404,
                message: 'Book not found',
            }
        }
    })
    @ApiBody({
        description: 'Order creation data',
        type: CreateOrderDto,
        required: true,
        schema: {
            type: 'object',
            properties: {
                book_id: { type: 'number', example: 1 },
                book_quantity: { type: 'number', example: 2 },
                user_id: { type: 'number', example: 1 },
            },
            required: ['book_id', 'book_quantity', 'user_id'],
        }
    })
    @Post()
    async createOrder(createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({
        status: 200,
        description: 'Orders retrieved successfully',      
        schema: {
            example: {
                status_code: 200,
                message: 'Orders retrieved successfully',
                data: [
                    {
                        id: 1,
                        book_id: 1,
                        book_quantity: 2,
                        user_id: 1,
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        book: {
                            id: 1,
                            title: 'Bilim Xazna',
                            author: 'Bilim Xazna',
                            description: 'Bilim Xazna kitobi haqida',
                            price: 20000,
                            rating: 4,
                            language: 'UZ',
                            quantity: 100,
                            image: ['image1.jpg', 'image2.jpg'],
                        }
                    }
                ]
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'No orders found',
        schema: {
            example: {
                status_code: 404,
                message: 'No orders found',
                data: []
            }
        }
    })
    @Get()
    async getOrders() {
        return this.orderService.getOrders();
    }

    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({
        status: 200,
        description: 'Order retrieved successfully',          
        schema: {
            example: {
                status_code: 200,
                message: 'Order retrieved successfully',
                data: {
                    id: 1,
                    book_id: 1,
                    book_quantity: 2,
                    user_id: 1,
                    createdAt: '2023-10-01T00:00:00Z',
                    updatedAt: '2023-10-01T00:00:00Z',
                    book: {
                        id: 1,
                        title: 'Bilim Xazna',
                        author: 'Bilim Xazna',
                        description: 'Bilim Xazna kitobi haqida',
                        price: 20000,
                        rating: 4,
                        language: 'UZ',
                        quantity: 100,
                        image: ['image1.jpg', 'image2.jpg'],
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Order not found',
        schema: {
            example: {
                status_code: 404,
                message: 'Order with id 1 not found',
            }
        }
    })
    @Get(':id')
    async getOrderById(id: string){
        return this.orderService.getOrderById(+id);
    }

    @ApiOperation({ summary: 'Update order by ID' })
    @ApiResponse({
        status: 200,
        description: 'Order updated successfully',          
        schema: {
            example: {
                status_code: 200,
                message: 'Order updated successfully',
                data: {
                    id: 1,
                    book_id: 1,
                    book_quantity: 2,
                    user_id: 1,
                    createdAt: '2023-10-01T00:00:00Z',
                    updatedAt: '2023-10-01T00:00:00Z',
                    book: {
                        id: 1,
                        title: 'Bilim Xazna',
                        author: 'Bilim Xazna',
                        description: 'Bilim Xazna kitobi haqida',
                        price: 20000,
                        rating: 4,
                        language: 'UZ',
                        quantity: 100,
                        image: ['image1.jpg', 'image2.jpg'],
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Order not found',
        schema: {
            example: {
                status_code: 404,
                message: 'Order with id 1 not found',
            }
        }
    })
    @Patch(':id')
    async updateOrder(id: string, updateOrderDto: UpdateOrderDto){
        return this.orderService.updateOrder(+id, updateOrderDto);
    }

    @ApiOperation({ summary: 'Delete order by ID' })
    @ApiResponse({
        status: 200,
        description: 'Order deleted successfully',     
        schema: {
            example: {
                status_code: 200,
                message: 'Order deleted successfully',
                data: null
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Order not found',
        schema: {
            example: {
                status_code: 404,
                message: 'Order with id 1 not found',
            }
        }
    }) 
    @ApiResponse({
        status: 400,
        description: 'Bad request, invalid input data',
        schema: {
            example: {
                status_code: 400,
                message: 'Error on deleting order: Order not found',
            }
        }
    })
    @Delete(':id')
    async deleteOrder(id: string) {
        return this.orderService.deleteOrder(+id);
    }
}
