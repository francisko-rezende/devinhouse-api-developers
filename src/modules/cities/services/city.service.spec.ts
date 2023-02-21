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
});
