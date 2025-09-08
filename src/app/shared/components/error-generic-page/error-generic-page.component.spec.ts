import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorGenericPageComponent } from './error-generic-page.component';
import { By } from '@angular/platform-browser';

describe('ErrorGenericPageComponent', () => {
  let component: ErrorGenericPageComponent;
  let fixture: ComponentFixture<ErrorGenericPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorGenericPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorGenericPageComponent);
    component = fixture.componentInstance;

    // Definindo inputs padrão
    component.errorCode = '404';
    component.errorTitle = 'Página não encontrada';
    component.errorMessage = 'O recurso solicitado não foi encontrado.';
    component.buttonText = 'Voltar ao início';
    component.buttonLink = '/home';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render error code, title and message', () => {
    const codeEl = fixture.debugElement.query(By.css('.error-code')).nativeElement;
    const titleEl = fixture.debugElement.query(By.css('.error-title')).nativeElement;
    const messageEl = fixture.debugElement.query(By.css('.error-message')).nativeElement;

    expect(codeEl.textContent).toContain('404');
    expect(titleEl.textContent).toContain('Página não encontrada');
    expect(messageEl.textContent).toContain('O recurso solicitado não foi encontrado.');
  });

  it('should render button with correct text', () => {
    const buttonEl = fixture.debugElement.query(By.css('app-button')).nativeElement;
    expect(buttonEl.getAttribute('ng-reflect-label')).toBe('Voltar ao início');
  });

  it('should call goToPage when button is clicked', () => {
    spyOn(component, 'goToPage');

    const buttonDe = fixture.debugElement.query(By.css('app-button'));
    buttonDe.triggerEventHandler('click', null);

    expect(component.goToPage).toHaveBeenCalled();
  });

  it('should log the correct redirect message when goToPage is called', () => {
    spyOn(console, 'log');
    component.goToPage();
    expect(console.log).toHaveBeenCalledWith('Redirecting to the page... /home');
  });
});
