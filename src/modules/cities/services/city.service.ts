import { UpdateCityDto } from './../dto/update-city.dto';
import { StateRepository } from './../../states/state.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from '../dto/create-city.dto';
import { CityRepository } from '../city.repository';
import { CityEntity } from '../entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
  ) {}

  async findById(id: number): Promise<CityEntity> {
    const foundCity = await this.cityRepository.getById(id);
    if (!foundCity) {
      throw new NotFoundException('cityNotFound');
    }

    return foundCity;
  }

  async createCity(newCity: CreateCityDto): Promise<CityEntity> {
    const sameNameCity = this.cityRepository.getByName(newCity.name);
    const sameStateIdCity = this.cityRepository.getByStateId(newCity.state_id);

    if (sameNameCity || sameStateIdCity) {
      throw new BadRequestException('entityWithArgumentsExists');
    }

    const newCityState = await this.stateRepository.findOne({
      where: { id: newCity.state_id },
    });

    if (!newCityState) {
      throw new NotFoundException('stateNotFound');
    }

    return await this.cityRepository.createCity(newCity);
  }

  async deleteCity(id: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const cityToDelete = await this.cityRepository.getById(id);

        if (!cityToDelete) {
          throw new NotFoundException('cityNotFound');
        }

        const deletedCity = await this.cityRepository.deleteCity(cityToDelete);

        if (!deletedCity) {
          throw new BadRequestException('CityNotDeleted');
        }

        resolve('Cidade apagada com sucesso');
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateCity(
    id: number,
    updateCityDto: UpdateCityDto,
  ): Promise<CityEntity> {
    const cityToUpdate = await this.cityRepository.getById(id);

    if (!cityToUpdate) {
      throw new NotFoundException('cityNotFound');
    }

    try {
      const updatedCity = await this.cityRepository.updateCity({
        ...cityToUpdate,
        ...updateCityDto,
      });

      return updatedCity;
    } catch (error) {
      throw new BadRequestException('cityNotUpdate');
    }
  }
}
