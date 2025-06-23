import { from } from 'rxjs';
import { FindManyOptions } from 'typeorm';

export interface IResponse<T> {
  data: T;
  statusCode: number;
  message: string | string[];
}

export interface IResponsePagination<T> {
  data: T[];
  total_elements: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  from: number;
  to: number;
  status_code: number;
  message: string;
}

export interface IFindOtions<T> extends FindManyOptions<T> {}
