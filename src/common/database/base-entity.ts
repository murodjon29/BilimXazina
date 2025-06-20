import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    default: () => '(EXTRACT(epoch FROM NOW()) * 1000)::bigint',
  })
  updated_at: number;
}
