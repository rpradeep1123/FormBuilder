import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { FormControlModel } from '../models/form-control.model';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  saveForm(request: FormControlModel) {
    return this.http.post<any>(environment.apiURL + '/FormCaptureRequest', request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }
  updateForm(request: FormControlModel) {
    return this.http.post<any>(environment.apiURL + '/FormUpdateRequest', request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }
  getFormList() {
    return this.http.post<any>(environment.apiURL + '/FormListRequest','').pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }
  handleError(error) {
    return throwError(error);
  }
}
