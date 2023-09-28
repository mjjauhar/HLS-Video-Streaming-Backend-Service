import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { Roles } from './roles/decorators/roles.decorator';
// import { Role } from './roles/entities/roles.enum';
import { Permission } from './permissions/entity';
import { Permissions } from './permissions/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Permissions(Permission.ACCESS_CONTENT)
  getHello(): string {
    return this.appService.getHomePage();
  }
}
