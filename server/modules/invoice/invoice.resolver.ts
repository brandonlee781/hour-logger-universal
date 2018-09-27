import { Query, Resolver, ResolveProperty, Mutation, Context, Args, Parent } from '@nestjs/graphql';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/AuthGuard/AuthGuard.guard';
import { UserService } from '../user/user.service';
import { LogService } from '../log';
import { ProjectService } from '../project';
import { GetUser } from '../user/pipes/GetUser.pipe';
import { User } from '../user';
import { GqlAuthGuard } from '../auth/guards/GqlAuthGuard/GqlAuthGuard.guard';

@Resolver('Invoice')
@UseGuards(GqlAuthGuard)
export class InvoiceResolver {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly logService: LogService,
  ) {}

  @Query('allInvoices')
  async allInvoices(
    @Context('request', GetUser) user: User
  ) {
    const invoices: Invoice[] = await this.invoiceService.findAll(user.id);
    return { invoices };
  }

  @Query('oneInvoice')
  async oneInvoice(
    @Args('input') { id, number }: { id?: string, number?: number },
    @Context('request', GetUser) user: User
  ) {
    const invoice: Invoice = await this.invoiceService.findOne(id || number, user);
    return { invoice };
  }

  @Mutation()
  async createInvoice(
    @Args('input') input,
    @Context('request', GetUser) user: User
  ) {
    const newInvoice: Invoice = await this.invoiceService.create(
      input,
      user,
    );
    return { invoice: newInvoice };
  }

  @Mutation()
  async deleteInvoice(
    @Args('input') { id }: { id?: string },
    @Context('request', GetUser) user: User
  ) {
    const invoice: Invoice = await this.invoiceService.delete(id, user);
    return { invoice };
  }
}
