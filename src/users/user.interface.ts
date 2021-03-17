import CreateCategoryDto from "category/category.dto";

interface AddressInUser {
  id: string;
  street: string;
  city: string;
}

interface PostInUser {
  id: string;
  content: string;
  title: string;
  author: 
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: {
    street: string;
    city: string;
  },
  posts?: []
}

export default User;
