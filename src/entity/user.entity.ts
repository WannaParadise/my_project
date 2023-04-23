import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'blob', nullable: true })
  pdf: Buffer;
}