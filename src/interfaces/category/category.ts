export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent: Category;
  count: number;
  children: Category[];
};

export type CreateCategory = {
  name: string;
  description: string;
};
