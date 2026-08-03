import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {}