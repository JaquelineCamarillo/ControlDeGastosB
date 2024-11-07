import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TwitchService } from '../../services/twitch.service'; // Ajusta la ruta según tu estructura
import { TwitchComponent } from './twitch.component';

describe('TwitchComponent', () => {
  let component: TwitchComponent;
  let fixture: ComponentFixture<TwitchComponent>;
  let mockTwitchService: jasmine.SpyObj<TwitchService>;

  beforeEach(async () => {
    // Crea un mock de TwitchService con Jasmine
    mockTwitchService = jasmine.createSpyObj('TwitchService', ['getStreams']);

    await TestBed.configureTestingModule({
      declarations: [TwitchComponent],
      providers: [
        { provide: TwitchService, useValue: mockTwitchService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Aquí puedes agregar pruebas adicionales para tu componente
});