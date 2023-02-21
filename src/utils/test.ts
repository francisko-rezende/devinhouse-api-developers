import { UpdateCityDto } from './../modules/cities/dto/update-city.dto';
import { CreateCityDto } from './../modules/cities/dto/create-city.dto';
import { CreateCountryDto } from 'src/core/dtos';
import { CityEntity, CountryEntity, StateEntity } from 'src/core/entities';

export class TestStatic {
  static countryData(): CountryEntity {
    const country = new CountryEntity();
    country.id = 1;
    country.language = 'Português';
    country.name = 'Brasil';
    country.createdAt = new Date();
    country.updatedAt = new Date();
    country.deletedAt = null;

    return country;
  }

  static countryDto(): CreateCountryDto {
    const countryBodyDto = new CreateCountryDto();
    countryBodyDto.language = 'Português';
    countryBodyDto.name = 'Brasil';

    return countryBodyDto;
  }

  static countriesData(): CountryEntity[] {
    const countries = ['Brasil', 'Canada', 'China'].map((name, index) => {
      const country = new CountryEntity();
      country.id = index + 1;
      country.language = 'Português';
      country.name = name;
      country.createdAt = new Date(`2023-02-1${index + 1} 12:06:12.090`);
      country.updatedAt = new Date(`2023-02-1${index + 1} 12:06:12.090`);
      country.deletedAt = null;

      return country;
    });

    return countries;
  }

  static stateData(): StateEntity {
    const state = new StateEntity();
    state.name = 'Minas Gerais';
    state.initials = 'MG';
    state.country_id = 1;

    return state;
  }

  static cityData(): CityEntity {
    const city = new CityEntity();
    city.id = 1;
    city.name = 'Tagamandápio';
    city.state_id = 1;
    city.createdAt = new Date();
    city.updatedAt = new Date();
    city.deletedAt = null;

    return city;
  }

  static createCityDto(): CreateCityDto {
    const cityDto = new CreateCityDto();
    cityDto.name = 'Tagamandápio';
    cityDto.state_id = 1;

    return cityDto;
  }

  static updateCityDto(): UpdateCityDto {
    const cityDto = new UpdateCityDto();
    cityDto.name = 'Tagamandápio';
    cityDto.state_id = 1;

    return cityDto;
  }
}
