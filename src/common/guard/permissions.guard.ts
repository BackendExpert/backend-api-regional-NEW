import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/role/role.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private rolesService: RoleService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredPermissions =
            this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const permissions = await this.rolesService.GetPermissions(user.role);

        const hasPermission = requiredPermissions.every(p =>
            permissions.includes(p),
        );

        if (!hasPermission)
            throw new ForbiddenException('Access denied');

        return true;
    }
}