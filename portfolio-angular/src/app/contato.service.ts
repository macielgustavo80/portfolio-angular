import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';

export interface ContatoDados {
  nome: string;
  email: string;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private http = inject(HttpClient);

  enviar(dados: ContatoDados): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${API_URL}/contato.php`, dados);
  }
}
