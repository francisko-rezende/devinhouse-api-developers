import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { CityEntity } from './entities/city.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CityRepository extends Repository<CityEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(CityEntity, dataSource.createEntityManager());
  }
  async getById(id: number): Promise<CityEntity> {
    return this.findOne({ where: { id } });
  }

  async getByAll(): Promise<CityEntity[]> {
    return this.find();
  }

  async createCity(newCity: CreateCityDto): Promise<CityEntity> {
    const city = new CityEntity();
    city.state_id = newCity.state_id;
    city.name = newCity.name;

    return await this.save(city);
  }

  async updateCity(city: CityEntity): Promise<CityEntity> {
    const updatedCity = await this.save(city);
    return await this.save(updatedCity);
  }

  async deleteCity(cityToDelete: CityEntity): Promise<boolean> {
    const deletedCity = await this.delete(cityToDelete);

    return deletedCity ? true : false;
  }

  async getByName(searchedName: string): Promise<CityEntity> {
    const searchedCity = this.findOne({ where: { name: searchedName } });

    return searchedCity;
  }

  async getByStateId(searchedStateId: number): Promise<CityEntity> {
    const searchedCity = this.findOne({ where: { state_id: searchedStateId } });

    return searchedCity;
  }
}
