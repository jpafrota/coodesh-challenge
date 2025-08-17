import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserHistory extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  word: string;

  @Prop({ default: Date.now })
  added: Date;
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);

// Compound index for efficient queries
UserHistorySchema.index({ userId: 1, added: -1 });
UserHistorySchema.index({ userId: 1, word: 1 }, { unique: true });