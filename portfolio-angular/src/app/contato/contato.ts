import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {}
