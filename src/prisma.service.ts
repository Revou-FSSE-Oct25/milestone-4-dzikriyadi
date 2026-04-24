// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     const connectionString = process.env.DATABASE_URL ?? '';
//     const adapter = new PrismaPg({
//       connectionString,
//     });
//     super({ adapter });
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
}
