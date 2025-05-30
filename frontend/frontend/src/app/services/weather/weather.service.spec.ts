import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('OBTENER EL PRONOSTICO DEL TIEMPO DE LA API', () => {
    const dummyData = { forecast: { forecastday: [] } };
    const city = 'Cádiz';

    service.getForecast(city).subscribe(data => {
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(
      `https://api.weatherapi.com/v1/forecast.json?key=dfa33c8d7d8b42b992701547250705&q=${city}&days=7`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
