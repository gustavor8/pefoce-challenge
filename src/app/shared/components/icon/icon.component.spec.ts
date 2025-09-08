import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let nativeElement: HTMLElement;
  let iElement: HTMLElement;

  // Função auxiliar para simplificar a busca do elemento <i>
  const findIconElement = () => {
    iElement = nativeElement.querySelector('i') as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    component.name = 'search';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Inputs and Class Application', () => {
    it('should apply the correct icon class based on the "name" input', () => {
      component.name = 'search';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('bi')).toBeTrue();
      expect(iElement.classList.contains('bi-search')).toBeTrue();
    });

    it('should change the icon class when the "name" input changes', () => {
      component.name = 'search';
      fixture.detectChanges();

      component.name = 'edit';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('bi-pencil-square')).toBeTrue();
      expect(iElement.classList.contains('bi-search')).toBeFalse();
    });

    it('should apply the default size class "icon-md" when no size is provided', () => {
      component.name = 'search';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('icon-md')).toBeTrue();
    });

    it('should apply the "icon-sm" class for size "sm"', () => {
      component.name = 'search';
      component.size = 'sm';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('icon-sm')).toBeTrue();
      expect(iElement.classList.contains('icon-md')).toBeFalse();
    });

    it('should apply the "icon-lg" class for size "lg"', () => {
      component.name = 'search';
      component.size = 'lg';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('icon-lg')).toBeTrue();
      expect(iElement.classList.contains('icon-md')).toBeFalse();
    });

    it('should update both icon and size classes when inputs change', () => {
      component.name = 'search';
      component.size = 'md';
      fixture.detectChanges();

      component.name = 'delete';
      component.size = 'lg';
      fixture.detectChanges();
      findIconElement();

      expect(iElement.classList.contains('bi-trash')).toBeTrue();
      expect(iElement.classList.contains('icon-lg')).toBeTrue();

      expect(iElement.classList.contains('bi-search')).toBeFalse();
      expect(iElement.classList.contains('icon-md')).toBeFalse();
    });
  });
});
