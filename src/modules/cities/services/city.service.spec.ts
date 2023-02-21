import { NotFoundException } from '@nestjs/common';
import { StateRepository } from './../../states/state.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CityRepository } from './../city.repository';
import { CityService } from './city.service';
import { TestStatic } from 'src/utils/test';

describe('cityService', () => {
  let cityService;

  const mockCityRespository = {
    getById: jest.fn(),
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
});
