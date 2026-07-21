import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterAll, beforeAll, describe, it } from '@jest/globals';
import { ZodValidationPipe } from 'nestjs-zod';
import request = require('supertest');

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API security (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'e2e-test-secret-change-me-in-production';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ZodValidationPipe());

    await app.init();
  });

  it('rejects requests without JWT', async () => {
    await request(app.getHttpServer()).get('/api/workspaces').expect(401);
  });

  afterAll(async () => {
    await app?.close();
  });
});
