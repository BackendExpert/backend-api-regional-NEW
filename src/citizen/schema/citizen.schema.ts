import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CitizenDocument = Citizen & Document;

@Schema({ timestamps: true })
export class Citizen {
  @Prop({ required: true })
  nic: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop()
  full_name: string;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  date_of_birth: Date;

  @Prop()
  household_id: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ enum: ['single', 'married', 'divorced', 'widowed', 'other'] })
  marital_status: string;

  @Prop()
  occupation: string;

  @Prop({ required: true, enum: ['None', 'Grade 5', 'Grade 8', 'OL', 'AL', 'University', 'Undergraduate', 'Postgraduate'] })
  education_level: string;

  @Prop({ required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] })
  blood_group: string;

  @Prop({ default: "sri_lankan" })
  nationality: string;

  @Prop()
  notes: string;

  @Prop({ default: true })
  status: boolean;
}

export const CitizenSchema = SchemaFactory.createForClass(Citizen);