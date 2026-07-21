import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { WorkspacesService } from './workspaces.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import {
  CreateWorkspaceDto,
  InviteUserToWorkspaceDto,
  UpdateWorkspaceDto,
} from '../dto/workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.findAll(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(user.id, dto);
  }

  @Patch(':workspaceId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(user.id, workspaceId, dto);
  }

  @Delete(':workspaceId')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ) {
    return this.workspacesService.remove(user.id, workspaceId);
  }

  @Post(':workspaceId/members')
  addMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: InviteUserToWorkspaceDto,
  ) {
    return this.workspacesService.addMember(user.id, workspaceId, dto);
  }
}
