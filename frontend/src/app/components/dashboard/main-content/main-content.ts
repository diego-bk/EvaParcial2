import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-content.html',
  styleUrl: './main-content.css'
})
export class MainContentComponent {
  // Este componente sirve principalmente como contenedor para los componentes de entidad
  // que se mostrarán a través del router-outlet
}
