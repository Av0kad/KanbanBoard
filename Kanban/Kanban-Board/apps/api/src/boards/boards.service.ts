import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, workspaceId: string, dto: CreateBoardDto) {
    await this.ensureUserHasWorkspaceAccess(userId, workspaceId);

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
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.ensureUserHasWorkspaceAccess(userId, board.workspaceId);

    return this.prisma.board.update({
      where: { id: boardId },
      data: {
        title: dto.title,
      },
      include: {
        tasks: true,
      },
    });
  }

  async remove(userId: string, boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.ensureUserHasWorkspaceAccess(userId, board.workspaceId);

    return this.prisma.board.delete({
      where: { id: boardId },
    });
  }

  private async ensureUserHasWorkspaceAccess(
    userId: string,
    workspaceId: string,
  ) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return membership;
  }
}
