import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountEntity } from './entities/account.entity';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { UseGuards } from '@nestjs/common';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // CREATE
  @Post()
  // @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const userId = req['user']?.id;
    return this.accountService.create(userId, dto);
  }

  // GET ALL
  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request): Promise<AccountEntity[]> {
    const userId = req['user']?.id;
    return this.accountService.findAll(userId);
  }

  // GET ONE
  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    const userId = req['user']?.id;
    return this.accountService.findOne(userId, id);
  }

  // UPDATE
  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const userId = req['user']?.id;
    return this.accountService.update(userId, id, dto);
  }

  // DELETE
  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Req() req: Request, @Param('id') id: string): Promise<AccountEntity> {
    const userId = req['user']?.id;
    return this.accountService.remove(userId, id);
  }
}
