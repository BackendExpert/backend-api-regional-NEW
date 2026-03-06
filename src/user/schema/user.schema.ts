import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema({ timestamps: true })

export class User {
    @Prop({ unique: true, required: true })
    email: string

    @Prop({ required: true, enum: ['super_admin', 'system_admin', 'data_entry_officer', 'data_manager', 'welfare_officer', 'agriculture_officer', 'health_officer', 'education_officer', 'analyst', 'auditor', 'citizen'], default: 'citizen' })
    role: string

    @Prop({ required: true, default: new Date() })
    last_login: Date

    @Prop({ required: true, default: true })
    account_stats: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);