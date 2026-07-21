import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'node:path';

import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { WorkspaceAccessModule } from './common/access/workspace-access.module';
import { validateEnvironment } from './config/env.schema';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '../../.env'),
        join(process.cwd(), '.env'),
      ],
      validate: validateEnvironment,
    }),
    PrismaModule,
    WorkspaceAccessModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    BoardsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
