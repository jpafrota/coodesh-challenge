import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { WordsModule } from "./words/words.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, WordsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
