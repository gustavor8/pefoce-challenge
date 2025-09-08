import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';

interface UrlPorperties {
  platform: string;
  url?: string;
  icon: string;
}

interface FooterLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IconComponent, IconButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements AfterViewInit {
  showButtoScrollTop = false;

  @Input() logoUrl?: string;
  @Input() logoAlt?: string;
  @Input() currentYear?: number;
  @Input() version?: string;
  @Input() copyrightText?: string;
  @Input() socialLinks?: UrlPorperties[] = [];
  @Input() address?: string;
  @Input() footerLinks: FooterLink[] = [];
  @Input() department?: string;

  @ViewChild('footerElement') footerElement!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.checkFooterPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkFooterPosition();
  }

  private checkFooterPosition(): void {
    const footer = this.footerElement?.nativeElement;
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const distanceFromTop = rect.top + window.scrollY;

      if (distanceFromTop > 400) {
        this.showButtoScrollTop = true;
      } else {
        this.showButtoScrollTop = false;
      }
    }
  }

  onClick(event: MouseEvent): void {
    if (this.showButtoScrollTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
