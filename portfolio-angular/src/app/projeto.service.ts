import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
  status?: string;
}

export interface ProjetoDados {
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/projetos.php`;

  listar(todos = false): Observable<Projeto[]> {
    const url = todos ? `${this.url}?todos=1` : this.url;
    return this.http.get<Projeto[]>(url);
  }

  criar(dados: ProjetoDados): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.url, dados);
  }

  atualizar(id: number, dados: ProjetoDados): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${this.url}?id=${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}?id=${id}`);
  }
}
