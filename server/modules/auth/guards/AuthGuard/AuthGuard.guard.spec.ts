import { AuthGuard } from './AuthGuard.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthGuard', () => {
  // it('should set a valid payload', () => {
  //   const mockReq = {
  //     username: 'johndoe',
  //     password: 'secret',
  //     logIn: () => {},
  //   };
  //   const authGuard = new AuthGuard();

  //   jest
  //     .spyOn(authGuard, 'canActivate')
  //     .mockImplementationOnce((payload) => {
  //       if (payload.username === 'johndoe' && payload.password === 'secret') {
  //         return true;
  //       }
  //       return new HttpException('', HttpStatus.UNAUTHORIZED);
  //     });

  //   expect(authGuard.canActivate(mockReq)).toBe(true);
  // });

  // it('should set a valid payload', () => {
  //   const mockReq = {
  //     username: 'johndoe',
  //     password: 'secret2',
  //     logIn: () => {},
  //   };
  //   const error = new HttpException('', HttpStatus.UNAUTHORIZED);
  //   const authGuard = new AuthGuard();

  //   jest
  //     .spyOn(authGuard, 'canActivate')
  //     .mockImplementationOnce((payload) => {
  //       if (payload.username === 'johndoe' && payload.password === 'secret') {
  //         return true;
  //       }
  //       return new HttpException('', HttpStatus.UNAUTHORIZED);
  //     });

  //   expect(authGuard.canActivate(mockReq)).toEqual(error);
  // });
});
