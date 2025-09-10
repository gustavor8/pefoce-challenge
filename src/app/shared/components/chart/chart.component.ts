import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfig, ChartSize } from '../../../core/models/chart.models';
import { BreakpointService } from '../../../core/services/breakpoint/breakpoint.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [BaseChartDirective],
})
export class ChartComponent implements OnChanges {
  @Input() config!: ChartConfig;

  public chartData: any = { labels: [], datasets: [] };
  public chartOptions: any = {};
  public chartType: any = 'line';
  private breakpointService = inject(BreakpointService);
  private breakpointSubscription = new Subscription();

  public currentSize: ChartSize = 'auto';
  ngOnInit(): void {
    this.breakpointSubscription = combineLatest([
      this.breakpointService.isHandset$,
      this.breakpointService.isTablet$,
    ]).subscribe(([isHandset, isTablet]) => {
      if (isHandset) {
        this.currentSize = 'sm';
      } else if (isTablet) {
        this.currentSize = 'md';
      } else {
        this.currentSize = this.config?.size || 'lg';
      }
    });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.config) return;

    this.chartType = this.config.type;
    this.chartData = this.config.data;
    this.chartOptions = this.buildOptions(this.config);
  }

  private buildOptions(config: ChartConfig): any {
    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: config.options?.plugins?.legend?.position || 'top',
          display: config.showLegend ?? true,
          onHover: (event: any, legendItem: any, legend: any) => {
            event.native?.target?.style?.setProperty('cursor', 'pointer');
          },
          onLeave: (event: any, legendItem: any, legend: any) => {
            event.native?.target?.style?.setProperty('cursor', 'default');
          },
        },
        title: {
          display: !!config.title,
          text: config.title,
          font: {
            size: config.options?.plugins?.title?.font?.size || 16,
            weight: config.options?.plugins?.title?.font?.weight || 'bold',
          },
        },
        tooltip: {
          enabled: config.showTooltips ?? true,
        },
      },
    };

    if (!['pie', 'doughnut', 'polarArea', 'radar'].includes(config.type)) {
      options.scales = {
        x: {
          display: true,
          title: {
            display: config.options?.scales?.x?.title?.display || false,
            text: config.options?.scales?.x?.title?.text || '',
          },
        },
        y: {
          display: true,
          title: {
            display: config.options?.scales?.y?.title?.display || false,
            text: config.options?.scales?.y?.title?.text || '',
          },
          beginAtZero: config.options?.scales?.y?.beginAtZero ?? true,
        },
      };
    }

    return options;
  }
}
