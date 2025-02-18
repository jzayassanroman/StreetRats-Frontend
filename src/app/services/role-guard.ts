import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';

export const roleGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const userRoles = authService.getRoles();
  console.log(userRoles);
  console.log('Token del usuario:', authService.getToken());
  console.log('Roles del usuario1:', userRoles);

  const allowedRoles = route.data?.['roles'];
  console.log('Roles permitidos:', allowedRoles);

  if (userRoles.length > 0 && userRoles.some(role => allowedRoles.includes(role))) {
    return true;
  } else {
    console.warn('Acceso denegado - redirigiendo...');
    router.navigate(['/']);
    return false;
  }
};
