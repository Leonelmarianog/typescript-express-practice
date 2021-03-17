import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @OneToOne(() => User, (user: User) => user.address)
  public user: string;
}

export default Address;
