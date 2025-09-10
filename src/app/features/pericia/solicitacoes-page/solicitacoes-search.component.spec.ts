import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesSearchComponent } from './solicitacoes-search.component';

describe('SolicitacoesSearchComponent', () => {
  let component: SolicitacoesSearchComponent;
  let fixture: ComponentFixture<SolicitacoesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
