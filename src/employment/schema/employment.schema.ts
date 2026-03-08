import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EmploymentDocument = Employment & Document

@Schema({ timestamps: true })

export class Employment {
    @Prop({ type: Types.ObjectId, ref: 'Citizen', required: true })
    citizan_id: Types.ObjectId;

    @Prop({ required: true })
    employment_status: string;

    @Prop({ required: true })
    job_title: string;

    @Prop({ required: true })
    company_name: string;

    @Prop({ required: true })
    sector: string;

    @Prop({ required: true })
    monthly_income: number;

    @Prop({ required: true, default: 'onsite', enum: ['onsite', 'online', 'hybrid'] })
    work_location_type: string;

    @Prop({ required: true })
    work_location: string;
}

export const EmploymentSchema = SchemaFactory.createForClass(Employment)