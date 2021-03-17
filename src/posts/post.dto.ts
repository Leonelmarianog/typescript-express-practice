// eslint-disable-next-line max-classes-per-file
import { IsString, ValidateNested } from 'class-validator';
import CreateCategoryDto from '../category/category.dto';

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;

  @ValidateNested()
  public categories: CreateCategoryDto[];
}

export default CreatePostDto;
