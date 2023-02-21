import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { StateService } from '../../states/services/state.service';
import { CityService } from '../services/city.service';
import axios from 'axios';
import { City } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dti';

@ApiTags('cities')
@Controller('city')
export class CityController {
  constructor(
    private cityService: CityService,
    private stateService: StateService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<CityEntity> {
    return await this.cityService.findById(id);
  }

  @Post('createAllCities')
  async createAllCities(): Promise<string> {
    try {
      const { data } = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      );
      const states = await this.stateService.getByAll();

      data.forEach((city: City) => {
        const state = states.find(
          ({ initials }) => city.microrregiao.mesorregiao.UF.sigla === initials,
        );

        const newCity = {
          name: city.nome,
          state_id: state.id,
        };

        this.cityService.createCity(newCity);
      });
      return 'Cidades salvas com sucesso';
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async deleteCityById(@Param('id') id: number): Promise<string> {
    return await this.cityService.deleteCity(id);
  }

  @Post('createCity')
  async createCity(@Body() newCity: CreateCityDto): Promise<CityEntity> {
    return await this.cityService.createCity(newCity);
  }

  @Patch('update/:id')
  async updateCity(
    @Param('id') id: number,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CityEntity> {
    return await this.cityService.updateCity(id, updateCityDto);
  }
}
