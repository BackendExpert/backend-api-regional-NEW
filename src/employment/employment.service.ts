import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "src/auditlogs/schema/auditlog.schema";
import { User, UserDocument } from "src/user/schema/user.schema";
import { Employment, EmploymentDocument } from "./schema/employment.schema";
import { Citizen, CitizenDocument } from "src/citizen/schema/citizen.schema";
import { JwtService } from "@nestjs/jwt";
import { CreateEmploymentDTO } from "./dto/create-employment.dto";

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

        if(!checkcitizan){
            throw new NotFoundException("The Citizan Not in System, Check the Citizan ID")
        }

        
    }
}