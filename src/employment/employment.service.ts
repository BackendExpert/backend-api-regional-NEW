import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { User, UserDocument } from "src/user/schema/user.schema";
import { Employment, EmploymentDocument } from "./schema/employment.schema";
import { Citizen, CitizenDocument } from "src/citizen/schema/citizen.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateEmploymentDTO } from "./dto/create-employment.dto";
import { createAuditLog } from "src/common/utils/auditlogs.util";


@Injectable()
export class EmploymentService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(AuditLog.name)
        private auditlogModel: Model<AuditLogDocument>,

        @InjectModel(Employment.name)
        private employmentModel: Model<EmploymentDocument>,

        @InjectModel(Citizen.name)
        private citizanModel: Model<CitizenDocument>,

        private readonly jwtService: JwtService
    ) { }

    async CreateEmploymentRecode(
        token: string,
        dto: CreateEmploymentDTO,
        ipAddress?: string,
        userAgent?: string
    ) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkcitizan = await this.citizanModel.findById(dto.citizan_id)

        if (!checkcitizan) {
            throw new NotFoundException("The Citizan Not in System, Check the Citizan ID")
        }

        const employment = await this.employmentModel.create({
            citizan_id: new Types.ObjectId(dto.citizan_id),
            employment_status: dto.employment_status,
            job_title: dto.job_title,
            company_name: dto.company_name,
            sector: dto.sector,
            monthly_income: dto.monthly_income,
            work_location_type: dto.work_location_type,
            work_location: dto.work_location
        })

        await createAuditLog(this.auditlogModel, {
            user: user._id,
            action: "CITIZAN_EMPLOYMENT_RECODE_CREATED",
            description: `New Employment Recode add to ${dto.citizan_id} by ${user.email}`,
            ipAddress,
            userAgent,
            metadata: { ipAddress, userAgent }
        });

        return { success: true, message: "The New Employment Recode Added Successs" }
    }

    async GetallEmploymentRecodes(token: string) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const fetchallrecodes = await this.employmentModel.find().populate('citizan_id')

        return { success: true, result: fetchallrecodes, message: "All Emaployment Recodes Fetched Success" }
    }

    async GetOneEmploymentRecode(token: string, id: string) {
        const payload = this.jwtService.verify(token)

        const user = await this.userModel.findOne({ email: payload.user })

        if (!user) {
            throw new NotFoundException("The User Not Found")
        }

        const checkrecode = await this.employmentModel.findById(id).populate('citizan_id')

        if(!checkrecode){
            throw new NotFoundException("The Recode Not Found by Given ID")
        }

        return { success: true, result: checkrecode, message: "The Data Fetched Successfully"}
    }

}