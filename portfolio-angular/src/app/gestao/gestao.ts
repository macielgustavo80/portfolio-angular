import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Projeto, ProjetoDados, ProjetoService } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css',
})
export class Gestao implements OnInit {
  private formBuilder = inject(FormBuilder);
  private service = inject(ProjetoService);

  projetos: Projeto[] = [];
  carregando = true;
  salvando = false;
  erro = '';
  editandoId: number | null = null;
  form = this.formBuilder.nonNullable.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    tecnologias: ['', Validators.required],
    link_github: [''],
    ano: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    status: ['rascunho', Validators.required],
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.service.listar(true).subscribe({
      next: (projetos) => {
        this.projetos = projetos;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os projetos.';
        this.carregando = false;
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';
    const dados: ProjetoDados = this.form.getRawValue();
    if (this.editandoId) {
      this.service.atualizar(this.editandoId, dados).subscribe({
        next: () => this.salvou(),
        error: () => this.erroAoSalvar(),
      });
      return;
    }

    this.service.criar(dados).subscribe({
      next: () => this.salvou(),
      error: () => this.erroAoSalvar(),
    });
  }

  editar(projeto: Projeto): void {
    this.editandoId = projeto.id;
    this.form.patchValue({
      nome: projeto.nome,
      descricao: projeto.descricao,
      tecnologias: projeto.tecnologias,
      link_github: projeto.link_github || '',
      ano: projeto.ano,
      status: projeto.status || 'rascunho',
    });
  }

  excluir(projeto: Projeto): void {
    if (!confirm(`Excluir o projeto "${projeto.nome}"?`)) {
      return;
    }

    this.erro = '';
    this.service.excluir(projeto.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter((item) => item.id !== projeto.id);
      },
      error: () => {
        this.erro = 'Não foi possível excluir o projeto.';
      },
    });
  }

  limparFormulario(): void {
    this.editandoId = null;
    this.form.reset({
      nome: '',
      descricao: '',
      tecnologias: '',
      link_github: '',
      ano: new Date().getFullYear(),
      status: 'rascunho',
    });
  }

  private salvou(): void {
    this.carregar();
    this.limparFormulario();
    this.salvando = false;
  }

  private erroAoSalvar(): void {
    this.erro = 'Não foi possível salvar o projeto.';
    this.salvando = false;
  }
}
