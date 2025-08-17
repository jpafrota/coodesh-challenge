import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop([{ word: String, added: { type: Date, default: Date.now } }])
  favoriteWords: { word: string; added: Date }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
