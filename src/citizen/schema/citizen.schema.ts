import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CitizenDocument = Citizen & Document

@Schema({ timestamps: true })

export class Citizen {

}

export const CitizenSchema = SchemaFactory.createForClass(Citizen)