import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { WordsModule } from "./words/words.module";

@Module({
  imports: [UsersModule, WordsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
