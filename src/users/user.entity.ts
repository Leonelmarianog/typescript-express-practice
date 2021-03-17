import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import Address from '../address/address.entity';
import Post from '../posts/post.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  // eslint-disable-next-line no-unused-vars
  @OneToOne((type) => Address, (address: Address) => address.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  // eslint-disable-next-line no-unused-vars
  @OneToMany((type) => Post, (post: Post) => post.author)
  public posts: Post[];
}

export default User;
