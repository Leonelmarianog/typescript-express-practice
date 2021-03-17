import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import User from '../users/user.entity';
import Category from '../category/category.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  // eslint-disable-next-line no-unused-vars
  @ManyToOne((type) => User, (author: User) => author.posts)
  public author: User;

  // eslint-disable-next-line no-unused-vars
  @ManyToMany((type) => Category, (category: Category) => category.posts, { cascade: true })
  @JoinTable()
  public categories: Category[];
}

export default Post;
