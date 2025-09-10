import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return next(req);
  }
  const cloneReq = req.clone({
    setHeaders: { token: token },
  });
  return next(cloneReq);
};
