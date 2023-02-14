import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CreateStateDto } from './dto/create-state.dto';
import { StateEntity } from './entities/state.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class StateRepository extends Repository<StateEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(StateEntity, dataSource.createEntityManager());
  }

  async getByAll(): Promise<StateEntity[]> {
    return this.find();
  }

  async createState(newState: CreateStateDto): Promise<void> {
    const state = new StateEntity();
    state.country_id = newState.country_id;
    state.name = newState.name;
    state.initials = newState.initials;

    await this.save(state);
  }
}
