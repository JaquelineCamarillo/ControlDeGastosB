import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../../services/twitch.service';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-twitch',
  templateUrl: './twitch.component.html',
  styleUrls: ['./twitch.component.css']
})
export class TwitchComponent implements OnInit {
  liveStreams: any[] = [];
  streamStatus: string = '';
  streamUrl: SafeResourceUrl | null = null;

  constructor(private twitchService: TwitchService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getStreams();
    this.verificarStream('loredo_31');
  }

  // Llama al servicio para obtener los streams en vivo
  getStreams() {
    const gameId = '2008869745'; 
    this.twitchService.getStreams(gameId).subscribe(
      (response: any) => {
        this.liveStreams = response.data;
        console.log(this.liveStreams); // Verifica que los datos lleguen correctamente
      },
      (error) => {
        console.error('Error obteniendo transmisiones en vivo:', error);
      }
    );
  }

  // Sanitiza la URL del stream para usarla en un iframe
  getSafeUrl(channelName: string): SafeResourceUrl {
    const url = `https://player.twitch.tv/?channel=${channelName}&parent=localhost`; // Reemplaza 'localhost' con el dominio correcto si no es 'localhost'
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }  

  verificarStream(username: string): void {
    this.twitchService.getStreamStatus(username).subscribe(response => {
      if (response.data.length > 0) {
        console.log('El usuario está en vivo', response.data);
        this.streamUrl = this.getSafeUrl(username);
      } else {
        console.log('El usuario no está en vivo');
      }
    }, error => {
      this.streamStatus = 'Error al obtener el estado del stream';
      console.error('Error al obtener el estado del stream', error);
    });
  }
}

