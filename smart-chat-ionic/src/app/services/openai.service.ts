import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  constructor(private http: HttpClient) { }

  sendQuestion(prompt: string) {
    return this.http.post(environment.baseUrl, { prompt })
  }
}
