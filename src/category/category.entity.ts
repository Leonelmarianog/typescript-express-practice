import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import Post from '../posts/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  // eslint-disable-next-line no-unused-vars
  @ManyToMany((type) => Post, (post: Post) => post.categories)
  public posts: Post[];
}

export default Category;
