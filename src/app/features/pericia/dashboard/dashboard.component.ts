import { Component } from '@angular/core';
import { ChartConfig, ChartOptions } from '../../../core/models/chart.models';
import { ChartComponent } from '../../../shared/components/chart/chart.component';

import { lineData, barData, pieData } from './mockdata-charts';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [ChartComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private baseOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
  };

  public lineConfig: ChartConfig = {
    type: 'line',
    data: lineData,
    title: 'Pericia recebidas X Realizadas',
    size: 'md',
    options: this.baseOptions,
  };
  public mainChart: ChartConfig = {
    type: 'line',
    data: lineData,
    title: 'Laudos concluídos x pendentes',
    size: 'auto',
    options: this.baseOptions,
  };

  public barConfig: ChartConfig = {
    type: 'bar',
    data: barData,
    title: 'Total de laudos x Produzidos',
    size: 'md',
    options: this.baseOptions,
  };

  public pieConfig: ChartConfig = {
    type: 'pie',
    data: pieData,
    title: 'Produção no mês',
    size: 'md',
    options: this.baseOptions,
    showDataLabels: true,
  };

  public charts = {
    line: this.lineConfig,
    bar: this.barConfig,
    pie: this.pieConfig,
  };
}
