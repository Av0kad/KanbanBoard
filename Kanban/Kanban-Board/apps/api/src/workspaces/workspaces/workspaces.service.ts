import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

import { WorkspaceAccessService } from '../../common/access/workspace-access.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import {
  CreateWorkspaceDto,
  InviteUserToWorkspaceDto,
  UpdateWorkspaceDto,
} from '../dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly workspaceAccess: WorkspaceAccessService,
  ) {}

  findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        boards: {
          include: {
            tasks: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          title: dto.title,
          ownerId: userId,
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: WorkspaceRole.OWNER,
        },
      });

      return {
        ...workspace,
        boards: [],
        members: [],
      };
    });
  }

  async update(userId: string, workspaceId: string, dto: UpdateWorkspaceDto) {
    await this.workspaceAccess.ensureOwner(userId, workspaceId);

    return this.prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        ...(dto.title !== undefined && {
          title: dto.title,
        }),
      },
      include: {
        boards: {
          include: {
            tasks: true,
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(userId: string, workspaceId: string) {
    await this.workspaceAccess.ensureOwner(userId, workspaceId);

    return this.prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
  }

  async addMember(
    ownerId: string,
    workspaceId: string,
    dto: InviteUserToWorkspaceDto,
  ) {
    await this.workspaceAccess.ensureOwner(ownerId, workspaceId);

    const userToAdd = await this.usersService.findByEmail(dto.email);

    if (!userToAdd) {
      throw new NotFoundException('User with this email was not found');
    }

    const existingMembership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToAdd.id,
          workspaceId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this workspace');
    }

    return this.prisma.workspaceMember.create({
      data: {
        userId: userToAdd.id,
        workspaceId,
        role: WorkspaceRole.MEMBER,
      },
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
