import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RoleDocument = Role & Document

@Schema({ timestamps: true })

export class Role {
    @Prop({ unique: true, required: true, enum: ['super_admin', 'system_admin', 'data_entry_officer', 'data_manager', 'welfare_officer', 'agriculture_officer', 'health_officer', 'education_officer', 'analyst', 'auditor', 'citizen'] })
    role: string

    @Prop({ required: true })
    permissions: string[]
}

export const RoleSchema = SchemaFactory.createForClass(Role);