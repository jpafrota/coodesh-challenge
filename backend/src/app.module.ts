import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DictionaryModule } from "./dictionary/dictionary.module";

@Module({
  imports: [UsersModule, AuthModule, DictionaryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
