import { ActivityType } from "./global.types";

export interface News {
  id: string;
  emoji: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  activities: ActivityType[];
  created_at: Date;
  updated_at: Date;
}

declare module "knex/types/tables" {
  interface Tables {
    news: News;

    friends: Friend;
  }
}
