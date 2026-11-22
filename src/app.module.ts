import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClothingModule } from './clothing/clothing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '12345678',
      database: 'store_pr8_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    ClothingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
