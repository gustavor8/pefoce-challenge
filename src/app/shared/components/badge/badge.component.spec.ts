import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default primary label correctly', () => {
    const labelElement = fixture.nativeElement.querySelector('.badge.primary');
    expect(labelElement.textContent).toContain('Label');
  });

  it('should render label correctly', () => {
    component.label = 'Label Teste';
    fixture.detectChanges();
    const labelElement = fixture.nativeElement.querySelector('.badge.primary');
    expect(labelElement.textContent).toContain('Label Teste');
  });

  it('should apply additional classes correctly', () => {
    component.additionalClasses = 'test-class';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.badge-container');
    expect(badge.classList).toContain('test-class');
  });

  it('should emit onClick event when clicked', () => {
    spyOn(component.onClick, 'emit');
    component.handleClick();
    expect(component.onClick.emit).toHaveBeenCalled();
  });

  it('should render list of badge variants correctly', () => {
    const badgeVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    badgeVariants.forEach(variant => {
      component.type = variant as BadgeComponent['type'];
      fixture.detectChanges();
      const badge = fixture.nativeElement.querySelector(`.badge.${variant}`);
      expect(badge).toBeTruthy();
    });
  })

});
