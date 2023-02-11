import { Knex } from "knex";
import { ActivityType, Languages } from "./global.types";

export interface News {
  id: string;
  emoji: string;
  created_at: Date;
  updated_at: Date;
}
export interface Translation {
  id: string;
  news_id: string;
  language: Languages;
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
    news_composite: Knex.CompositeTableType<News, Pick<News, "id">>;

    friends: Friend;
    friends_composite: Knex.CompositeTableType<
      Friend,
      Pick<Friend, "email" | "activities" | "name">
    >;

    translations: Translation;
    translations_composite: Knex.CompositeTableType<
      Translation,
      Pick<Translation, "description" | "title" | "language" | "news_id">
    >;
  }
}
