import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuditModule } from './audit/audit.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuditModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    TenantsModule,
    OrganizationsModule,
    CompaniesModule,
    BranchesModule,
    DepartmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



