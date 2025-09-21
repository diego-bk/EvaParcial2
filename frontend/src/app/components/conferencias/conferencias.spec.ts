import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ConferenciasComponent } from './conferencias';
import { ConferenciasService } from '../../services/conferencias.service';

describe('ConferenciasComponent', () => {
  let component: ConferenciasComponent;
  let fixture: ComponentFixture<ConferenciasComponent>;

  beforeEach(async () => {
    const mockConferenciasService = jasmine.createSpyObj('ConferenciasService', ['getConferencias', 'createConferencia', 'updateConferencia', 'deleteConferencia']);
    mockConferenciasService.getConferencias.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ConferenciasComponent],
      providers: [
        { provide: ConferenciasService, useValue: mockConferenciasService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
