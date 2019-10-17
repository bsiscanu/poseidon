import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environments/environment';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Collection } from '../collection';

@Injectable({
  providedIn: 'root'
})
export class DataListService {

  constructor(
    private http: HttpClient
  ) {

  }

  /**
   * Makes the HTTP request and filters the data
   *
   * @param {string} resolution
   * @param {string} period
   * @return {Observable<Collection>}
   */
  public load(resolution: string, period: string): Observable<Collection> {

    const method = 'GET';
    const request = `/data/00000264/${resolution}/last/${period}`;
    const timestamp = new Date().toUTCString();

    const content = method + request + timestamp + env.publicKey;
    const signature = hmacSHA256(content, env.privateKey);
    const hmac = 'hmac ' + env.publicKey + ':' + signature;

    const url = env.base + request;

    const headers = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: hmac,
        'Request-Date': timestamp
      })
    };

    return this.http.get(url, headers).pipe(
      map((outcome: any) => {

        const collection: Collection = {
          dates: outcome.dates
        };

        for (const series of outcome.data) {
          switch (series.name) {
            case 'Precipitation':
              collection.sum = series.values.sum;
              break;
            case 'HC Air temperature':
              collection.avg = series.values.avg;
              collection.min = series.values.min;
              collection.max = series.values.max;
              break;
          }
        }

        return collection;
      })
    );
  }

  /**
   * Normalizes the data for the main table
   *
   * @param {Collection} collection
   * @return {Array<Object>>}
   */
  public scatter(collection) {
    return collection.dates.map((date: Date, ind: number) => ({
      no: ind + 1,
      date,
      avg: collection.avg[ind],
      min: collection.min[ind],
      max: collection.max[ind],
      sum: collection.sum[ind]
    }));
  }
}
