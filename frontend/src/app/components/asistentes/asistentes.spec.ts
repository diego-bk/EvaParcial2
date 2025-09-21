import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AsistentesComponent } from './asistentes';
import { AsistentesService } from '../../services/asistentes.service';

describe('AsistentesComponent', () => {
  let component: AsistentesComponent;
  let fixture: ComponentFixture<AsistentesComponent>;

  beforeEach(async () => {
    const mockAsistentesService = jasmine.createSpyObj('AsistentesService', ['getAsistentes', 'createAsistente', 'updateAsistente', 'deleteAsistente']);
    mockAsistentesService.getAsistentes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AsistentesComponent],
      providers: [
        { provide: AsistentesService, useValue: mockAsistentesService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
