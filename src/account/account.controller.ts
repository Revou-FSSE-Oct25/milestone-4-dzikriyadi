import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a bank account for the authenticated user' })
  @ApiCreatedResponse({ type: AccountEntity })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountEntity> {
    return this.accountService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all bank accounts owned by the user' })
  @ApiOkResponse({ type: AccountEntity, isArray: true })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<AccountEntity[]> {
    return this.accountService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific bank account' })
  @ApiOkResponse({ type: AccountEntity })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    return this.accountService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank account' })
  @ApiOkResponse({ type: AccountEntity })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountEntity> {
    return this.accountService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank account' })
  @ApiOkResponse({ type: AccountEntity })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    return this.accountService.remove(user.id, id);
  }
}
