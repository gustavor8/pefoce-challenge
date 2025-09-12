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
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

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
  public plugins = [ChartDataLabels.default];

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
    const isCircular = ['pie', 'doughnut', 'polarArea'].includes(config.type);

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: config.options?.plugins?.legend?.position || 'top',
          display: config.showLegend ?? true,
          onHover: (event: any) => {
            event.native?.target?.style?.setProperty('cursor', 'pointer');
          },
          onLeave: (event: any) => {
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

    if (config.showDataLabels) {
      options.plugins.datalabels = {
        display: true,
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value: number) => {
          return value;
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.5)',
        textStrokeWidth: 2,
      };

      if (isCircular) {
        options.plugins.datalabels = {
          ...options.plugins.datalabels,
          anchor: 'center',
          align: 'center',
          formatter: (value: number, context: any) => {
            // Obter todos os dados válidos (não nulos) do dataset
            const dataset = context.chart.data.datasets[0];
            const validData = dataset.data.filter(
              (v: any) => v !== null && v !== undefined
            );

            // Calcular o total apenas com os valores válidos
            const total = validData.reduce((a: number, b: number) => a + b, 0);

            if (total === 0 || value === null || value === undefined) {
              return null; // Não mostrar label para valores nulos ou quando o total é zero
            }

            const percentage = ((value / total) * 100).toFixed(1);
            return parseFloat(percentage) > 3 ? `${percentage}%` : null;
          },
        };
      }
    } else {
      options.plugins.datalabels = {
        display: false,
      };
    }

    if (!isCircular && config.type !== 'radar') {
      options.scales = {
        x: {
          display: true,
          title: {
            display: !!config.options?.scales?.x?.title?.text,
            text: config.options?.scales?.x?.title?.text || '',
          },
        },
        y: {
          display: true,
          title: {
            display: !!config.options?.scales?.y?.title?.text,
            text: config.options?.scales?.y?.title?.text || '',
          },
          beginAtZero: config.options?.scales?.y?.beginAtZero ?? true,
        },
      };
    }

    return options;
  }
}
