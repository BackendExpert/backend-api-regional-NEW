import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmploymentDTO {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    citizan_id: string;

    @IsString()
    @IsNotEmpty()
    employment_status: string;

    @IsString()
    @IsNotEmpty()
    job_title: string;

    @IsString()
    @IsNotEmpty()
    company_name: string;

    @IsString()
    @IsNotEmpty()
    sector: string;

    @IsNumber()
    @IsNotEmpty()
    monthly_income: number;

    @IsString()
    @IsNotEmpty()
    work_location_type: string;

    @IsString()
    @IsNotEmpty()
    work_location: string;
}