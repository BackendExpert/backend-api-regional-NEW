import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsEmail } from "class-validator";

export class UpdateCitizanDTO {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    full_name?: string;

    @IsString()
    household_id?: string;

    @IsString()
    phone?: string;

    @IsEmail()
    email?: string;

    @IsEnum(['single', 'married', 'divorced', 'widowed', 'other'])
    marital_status?: string;

    @IsString()
    occupation?: string;

    @IsEnum(['None', 'Grade 5', 'Grade 8', 'OL', 'AL', 'University', 'Undergraduate', 'Postgraduate'])
    education_level: string;

    @IsString()
    nationality?: string;


    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}