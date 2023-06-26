import { TestBed } from '@angular/core/testing';

import { ServicioGithubService } from './servicio-github.service';

describe('ServicioGithubService', () => {
  let service: ServicioGithubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioGithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
