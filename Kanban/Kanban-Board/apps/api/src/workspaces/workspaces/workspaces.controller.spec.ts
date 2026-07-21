import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;

  beforeEach(async () => {
    const workspacesServiceMock = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      addMember: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [
        {
          provide: WorkspacesService,
          useValue: workspacesServiceMock,
        },
      ],
    }).compile();

    controller = module.get(WorkspacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
