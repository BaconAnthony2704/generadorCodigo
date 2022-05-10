import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MainHistoryService {

  constructor(
    private _http: HttpClient
  ) { }

  obtenerListadoTabla():Observable<any>{
    return this._http.get(environment.apiUrl+"Tabla/ObtenerTablas")
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((err, caught) => {
        console.error(err);
        throw err;
      }
      )
    )
  }

  obtenerCamposTablas(tabla:string):Observable<any>{
    return this._http.post(environment.apiUrl+"Tabla/ObtenerCamposTablas",{tabla:tabla})
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((err, caught) => {
        console.error(err);
        throw err;
      }
      )
    )
  }



}
