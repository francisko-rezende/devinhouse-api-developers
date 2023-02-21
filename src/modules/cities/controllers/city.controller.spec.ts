import { CityController } from './city.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from '../services/city.service';
import { StateService } from 'src/modules/states/services/state.service';
import { TestStatic } from 'src/utils/test';
describe('Cities controller', () => {
  let cityController: CityController;

  const mockCityService = {
    findById: jest.fn(),
    createCity: jest.fn(),
    updateCity: jest.fn(),
  };

  const mockStateService = {
    getByAll: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        CityService,
        { provide: CityService, useValue: mockCityService },
        { provide: StateService, useValue: mockStateService },
      ],
    }).compile();

    cityController = module.get<CityController>(CityController);
  });

  beforeEach(() => {
    mockCityService.findById.mockReset();
  });

  it('should be defined', () => {
    expect(cityController).toBeDefined();
  });

  describe('getById', () => {
    it('should return a city when an extant id is provided', async () => {
      const city = TestStatic.cityData();
      mockCityService.findById.mockReturnValue(city);
      const foundCity = await cityController.getById(city.id);
      expect(foundCity).toMatchObject({ id: city.id, name: 'Tagamandápio' });
    });
  });

  describe('createCity', () => {
    it('should create a city', async () => {
      const city = TestStatic.cityData();
      const cityDto = TestStatic.createCityDto();
      mockCityService.createCity.mockReturnValue(city);
      const createdCity = await cityController.createCity(cityDto);

      expect(createdCity).toMatchObject({ id: 1, name: 'Tagamandápio' });
    });
  });

  describe('updateCity', () => {
    it('should update a city', async () => {
      const city = TestStatic.cityData();
      const updateCityDto = TestStatic.updateCityDto();
      mockCityService.updateCity.mockReturnValue(city);

      const cityToUpdateId = 1;
      const updatedCity = await cityController.updateCity(
        cityToUpdateId,
        updateCityDto,
      );
      expect(updatedCity).toMatchObject({ id: 1, name: 'Tagamandápio' });
    });
  });
});
