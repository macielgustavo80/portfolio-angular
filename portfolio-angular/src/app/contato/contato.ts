import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {
  private formBuilder = inject(FormBuilder);
  private service = inject(ContatoService);

  form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]],
  });
  enviando = false;
  sucesso = '';
  erro = '';

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.sucesso = '';
    this.erro = '';

    this.service.enviar(this.form.getRawValue()).subscribe({
      next: () => {
        this.sucesso = 'Mensagem enviada com sucesso.';
        this.form.reset();
        this.enviando = false;
      },
      error: () => {
        this.erro = 'Não foi possível enviar. Tente de novo.';
        this.enviando = false;
      },
    });
  }
}
