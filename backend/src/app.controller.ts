import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: "Fullstack Challenge 🏅 - Dictionary" };
  }
}
