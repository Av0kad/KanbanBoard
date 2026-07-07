import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

type RequestWithUser = Request & {
  user: {
    id: string;
    email: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('workspaces/:workspaceId/boards')
  createBoard(
    @Req() req: RequestWithUser,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardsService.create(req.user.id, workspaceId, dto);
  }

  @Patch('boards/:boardId')
  updateBoard(
    @Req() req: RequestWithUser,
    @Param('boardId') boardId: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.update(req.user.id, boardId, dto);
  }

  @Delete('boards/:boardId')
  deleteBoard(@Req() req: RequestWithUser, @Param('boardId') boardId: string) {
    return this.boardsService.remove(req.user.id, boardId);
  }
}
