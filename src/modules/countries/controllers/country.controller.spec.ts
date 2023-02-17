import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestStatic } from 'src/utils/test';
import { CountryService } from '../services/country.service';
import { CountryController } from './country.controller';

describe('CountryController', () => {
  let countryController: CountryController;

  const mockService = {
    findById: jest.fn(),
    createCountry: jest.fn(),
    updateCountry: jest.fn(),
    deleteCountry: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [{ provide: CountryService, useValue: mockService }],
    }).compile();

    countryController = module.get<CountryController>(CountryController);
  });

  beforeEach(() => {
    mockService.createCountry.mockReset();
    mockService.deleteCountry.mockReset();
    mockService.findById.mockReset();
    mockService.updateCountry.mockReset();
  });

  it('deveria estar definido', () => {
    expect(countryController).toBeDefined();
  });

  describe('getById', () => {
    it('deveria retornar o resultado da busca e devolver um registro de dados de país', async () => {
      const country = TestStatic.countryData();
      mockService.findById.mockReturnValue(country);
      const foundCountry = await countryController.getById(country.id);
      expect(foundCountry).toMatchObject({ id: country.id });
      expect(mockService.findById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois o path param enviado não é um numérico', async () => {
      const anyValue = 'anyValue' as unknown as number;
      await countryController.getById(anyValue).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'FieldMustBeNumber',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });
});
