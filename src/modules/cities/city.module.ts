import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { StateModule } from '../states/state.module';
import { CityService } from './services/city.service';
import { CityRepository } from './city.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { StateRepository } from '../states/state.repository';

@Module({
  imports: [StateModule, TypeOrmModule.forFeature([CityEntity])],
  controllers: [CityController],
  providers: [CityService, CityRepository, StateRepository],
})
export class CityModule {}
