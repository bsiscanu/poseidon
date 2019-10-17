import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { env } from '../../environments/environment';
import { Observable } from 'rxjs';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataListService {

  constructor(
    private http: HttpClient
  ) {

  }

  public load() {

    const publicKey = '5321e4b2db1e104f6e82692503212467dc443e14c33741b4';
    const privateKey = '2b37834910994feeea3561afd506ff447cbcb9e766675e4f';

    const method = 'GET';
    const request = '/data/00000264/raw/last/24h';
    const timestamp = new Date().toUTCString();

    const content = method + request + timestamp + publicKey;
    const signature = hmacSHA256(content, privateKey);
    const hmac = 'hmac ' + publicKey + ':' + signature;

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

        const collection: {[key: string]: []} = {
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

        return collection.dates.map((date: Date, ind: number) => ({
          no: ind + 1,
          date,
          avg: collection.avg[ind],
          min: collection.min[ind],
          max: collection.max[ind],
          sum: collection.sum[ind]
        }));
      })
    );

  }
}
