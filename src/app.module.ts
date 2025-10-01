import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { MembersModule } from './members/members.module';
import { EmployeesModule } from './employees/employees.module';
import { ReservationsModule } from './reservations/reservations.module';
import { BorrowsModule } from './borrows/borrows.module';
import { LibrariesModule } from './libraries/libraries.module';

@Module({
  imports: [UsersModule, BookModule, MembersModule, EmployeesModule, ReservationsModule, BorrowsModule, LibrariesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
