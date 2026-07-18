import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceAccessService } from '../common/access/workspace-access.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccess: WorkspaceAccessService,
  ) {}

  async create(userId: string, workspaceId: string, dto: CreateBoardDto) {
    await this.workspaceAccess.ensureMember(userId, workspaceId);

    return this.prisma.board.create({
      data: {
        title: dto.title,
        workspaceId,
      },
      include: {
        tasks: true,
      },
    });
  }

  async update(userId: string, boardId: string, dto: UpdateBoardDto) {
    const board = await this.findBoardOrThrow(boardId);

    await this.workspaceAccess.ensureMember(userId, board.workspaceId);

    return this.prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        ...(dto.title !== undefined && {
          title: dto.title,
        }),
      },
      include: {
        tasks: true,
      },
    });
  }

  async remove(userId: string, boardId: string) {
    const board = await this.findBoardOrThrow(boardId);

    await this.workspaceAccess.ensureMember(userId, board.workspaceId);

    return this.prisma.board.delete({
      where: {
        id: boardId,
      },
    });
  }

  private async findBoardOrThrow(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }
}
