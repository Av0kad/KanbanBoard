import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { BoardsService } from './boards.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('workspaces/:workspaceId/boards')
  createBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardsService.create(user.id, workspaceId, dto);
  }

  @Patch('boards/:boardId')
  updateBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.update(user.id, boardId, dto);
  }

  @Delete('boards/:boardId')
  deleteBoard(
    @CurrentUser() user: AuthenticatedUser,
    @Param('boardId', new ParseUUIDPipe()) boardId: string,
  ) {
    return this.boardsService.remove(user.id, boardId);
  }
}
