import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StateRepository } from './../../states/state.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CityRepository } from './../city.repository';
import { CityService } from './city.service';
import { TestStatic } from 'src/utils/test';

describe('cityService', () => {
  let cityService;

  const mockCityRespository = {
    getById: jest.fn(),
    getByName: jest.fn(),
    getByStateId: jest.fn(),
    createCity: jest.fn(),
    updateCity: jest.fn(),
    // findById: jest.fn(),
    deleteCity: jest.fn(),
  };

  const mockStateRepository = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        { provide: StateRepository, useValue: mockStateRepository },
        { provide: CityRepository, useValue: mockCityRespository },
      ],
    }).compile();

    cityService = module.get<CityService>(CityService);
  });

  beforeEach(() => {
    mockCityRespository.getById.mockReset();
  });

  it('cityService should be defined', () => {
    expect(cityService).toBeDefined();
  });

  describe('findById', () => {
    it('returns a city entity', async () => {
      const city = TestStatic.cityData();
      mockCityRespository.getById.mockReturnValue(city);
      const foundCity = await cityService.findById(city.id);
      expect(foundCity).toMatchObject({ id: 1, name: 'Tagamandápio' });
      expect(mockCityRespository.getById).toBeCalledTimes(1);
    });

    it('throws an exception when id is not a number', async () => {
      mockCityRespository.getById.mockReturnValue(null);
      expect(cityService.findById(1)).rejects.toBeInstanceOf(NotFoundException);
      expect(mockCityRespository.getById).toBeCalledTimes(1);
    });
  });

  describe('createCity', () => {
    it('creates a new city', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.createCityDto();
      const state = TestStatic.stateData();

      mockCityRespository.createCity.mockReturnValue(city);
      mockCityRespository.getById.mockReturnValue(null);
      mockCityRespository.getByStateId.mockReturnValue(null);
      mockStateRepository.findOne.mockReturnValue(state);

      const createdCity = await cityService.createCity(cityDto);
      expect(createdCity).toMatchObject({ id: 1, name: 'Tagamandápio' });
      expect(mockCityRespository.createCity).toBeCalledTimes(1);
    });

    it('throws a bad request exception when city id is being used', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.countryDto();

      mockCityRespository.getByName.mockReturnValue(city);

      expect(cityService.createCity(cityDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('throws a bad request exception when city by state is found', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.createCityDto();

      mockCityRespository.getByStateId.mockReturnValue(city);

      expect(cityService.createCity(cityDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('updateCity', () => {
    it('it updates a city', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.updateCityDto();
      mockCityRespository.updateCity.mockReturnValue(city);
      mockCityRespository.getById.mockReturnValue(city);

      const cityToUpdateId = 1;
      const updatedCity = await cityService.updateCity(cityToUpdateId, cityDto);
      expect(updatedCity).toMatchObject({ id: 1, name: 'Tagamandápio' });
    });

    it('it throws a not found exception when city to update is not found', async () => {
      const cityDto = TestStatic.updateCityDto();
      mockCityRespository.getById.mockReturnValue(null);

      const cityToUpdateId = 1;
      expect(
        cityService.updateCity(cityToUpdateId, cityDto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('it throws a bad request exception when city is not saved', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.updateCityDto();
      mockCityRespository.updateCity.mockRejectedValue(
        new Error('Erro mockado'),
      );
      mockCityRespository.getById.mockReturnValue(city);

      const cityToUpdateId = 1;
      expect(
        cityService.updateCity(cityToUpdateId, cityDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('deleteCity', () => {
    it('should resolve to "Cidade apagada com sucesso" when it works', async () => {
      const cityToDelete = TestStatic.cityData();
      mockCityRespository.getById.mockReturnValue(cityToDelete);
      mockCityRespository.deleteCity.mockReturnValue(true);

      const cityToDeleteId = 1;

      expect(cityService.deleteCity(cityToDeleteId)).resolves.toBe(
        'Cidade apagada com sucesso',
      );
    });

    it('should throw a not found exception when the city to be deleted is not found', async () => {
      mockCityRespository.getById.mockReturnValue(null);

      const cityToDeleteId = 1;

      expect(cityService.deleteCity(cityToDeleteId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw a bad request exception when city is not deleted successfully', async () => {
      const city = TestStatic.cityData();
      mockCityRespository.getById.mockReturnValue(city);
      mockCityRespository.deleteCity.mockReturnValue(null);

      const cityToDeleteId = 1;

      expect(cityService.deleteCity(cityToDeleteId)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
