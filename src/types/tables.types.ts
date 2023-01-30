export interface News {
  id: string;
  emoji: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tables {
    news: News;

    users: User;
  }
}
