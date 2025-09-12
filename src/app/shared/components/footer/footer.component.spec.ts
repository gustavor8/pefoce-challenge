import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render props', () => {
    component.address = '123 Main St';
    component.copyrightText = ''
    component.currentYear = 2023;
    component.version = '1.0.0';
    component.department = 'pefoce'
    component.socialLinks = [{ platform: 'twitter', url: 'https://x.com', icon: 'twitter' }];

    component.footerLinks = [
      {
        label: 'Home',
        url: '/home'
      },
      {
        label: 'About',
        url: '/about'
      }
    ]
    component.logoAlt = 'pefoce'
    component.logoUrl = 'https://example.com/logo.png'

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.address-text').textContent).toContain(component.address);
    expect(fixture.nativeElement.querySelector('.copyright-text').textContent).toContain(component.copyrightText);
    expect(fixture.nativeElement.querySelector('.version-text').textContent).toContain(component.version);
    expect(fixture.nativeElement.querySelector('.department-text').textContent).toContain(component.department)
    expect(component.socialLinks?.length).toBe(1);
    expect(component.footerLinks.length).toBe(2);

  })

  it('should call checkFooterPosition on window scroll', () => {
    spyOn<any>(component, 'checkFooterPosition');
    component.onWindowScroll();
    expect(component['checkFooterPosition']).toHaveBeenCalled();
  });

  it('should scroll to top when onClick is called and showButtoScrollTop is true', () => {
    component.showButtoScrollTop = true;
    fixture.detectChanges();
    spyOn(window, 'scrollTo');

    component.onClick(new MouseEvent('click'));

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should set showButtoScrollTop = true when footer is far down', () => {
    spyOn(component.footerElement.nativeElement, 'getBoundingClientRect').and.returnValue({ top: 1000 } as DOMRect);
    (window as any).scrollY = 0;

    component['checkFooterPosition']();
    expect(component.showButtoScrollTop).toBeTrue();
  });


  it('should not scroll when onClick is called and showButtoScrollTop is false', () => {
    component.showButtoScrollTop = false;
    spyOn(window, 'scrollTo');

    component.onClick(new MouseEvent('click'));

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
