import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsEmail } from "class-validator";

export class CreateCitizenDTO {
    @IsString()
    nic: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    full_name?: string;

    @IsEnum(['male', 'female', 'other'])
    gender?: string;

    @IsDateString()
    date_of_birth?: Date;

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

    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    blood_group: string;

    @IsString()
    nationality?: string;


    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}