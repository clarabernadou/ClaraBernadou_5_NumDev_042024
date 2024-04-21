import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClient } from '@angular/common/http';

import { UserService } from './user.service';
import { User, Users, UsersWithoutOne } from './user.fixtures';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    service.getById = jest.fn().mockReturnValue(User);

    const result = service.getById('1');

    expect(result).toEqual(User);
  });

  it('should not get a user by id', () => {
    service.getById = jest.fn().mockReturnValue(null);

    const result = service.getById('1');

    expect(result).toBeNull();
  });

  it('should delete a user', () => {
    service.delete = jest.fn().mockReturnValue(null);

    const result = service.delete('1');

    expect(result).toEqual(null);
  });
});