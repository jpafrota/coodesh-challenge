import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Word extends Document {
  @Prop({ required: true, unique: true, index: true })
  word: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);