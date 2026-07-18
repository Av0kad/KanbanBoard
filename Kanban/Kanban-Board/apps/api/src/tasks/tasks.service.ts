import { Injectable, NotFoundException } from '@nestjs/common';

import { WorkspaceAccessService } from '../common/access/workspace-access.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceAccess: WorkspaceAccessService,
  ) {}

  async create(userId: string, boardId: string, dto: CreateTaskDto) {
    await this.ensureUserHasBoardAccess(userId, boardId);

    return this.prisma.task.create({
      data: {
        title: dto.title,
        boardId,
      },
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        boardId: true,
        board: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.workspaceAccess.ensureMember(userId, task.board.workspaceId);

    if (dto.boardId && dto.boardId !== task.boardId) {
      await this.ensureUserHasBoardAccess(userId, dto.boardId);
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...(dto.title !== undefined && {
          title: dto.title,
        }),
        ...(dto.boardId !== undefined && {
          boardId: dto.boardId,
        }),
      },
    });
  }

  async remove(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        board: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.workspaceAccess.ensureMember(userId, task.board.workspaceId);

    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  private async ensureUserHasBoardAccess(userId: string, boardId: string) {
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

    await this.workspaceAccess.ensureMember(userId, board.workspaceId);

    return board;
  }
}
