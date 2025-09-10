import { ChartData, ChartDataset } from '../../../core/models/chart.models';

export const lineDataset2023: ChartDataset<'line'> = {
  type: 'line',
  label: 'Transações 2023',
  data: [100, 1700, 800, 1700, 1900, 1200],
  borderColor: '#FF6384',
  backgroundColor: 'rgba(255, 99, 132, 0.2)',
  fill: true,
  borderWidth: 2,
  tension: 0.4,
};

export const lineDataset2024: ChartDataset<'line'> = {
  type: 'line',
  label: 'Transações 2024',
  data: [1800, 1500, 3000, 2100, 1000, 2300],
  borderColor: '#36A2EB',
  backgroundColor: 'rgba(54, 162, 235, 0.2)',
  fill: true,
  borderWidth: 2,
  tension: 0.4,
};

export const barDataset2023: ChartDataset<'bar'> = {
  type: 'bar',
  label: 'Clientes 2023',
  data: [120, 150, 130, 170, 160, 180],
  borderColor: '#FFCE56',
  backgroundColor: 'rgba(255, 206, 86, 0.5)',
  borderWidth: 2,
};

export const barDataset2024: ChartDataset<'bar'> = {
  type: 'bar',
  label: 'Clientes 2024',
  data: [140, 160, 150, 180, 170, 200],
  borderColor: '#4BC0C0',
  backgroundColor: 'rgba(75, 192, 192, 0.5)',
  borderWidth: 2,
};

export const pieDataset: ChartDataset<'pie'> = {
  type: 'pie',
  label: 'Distribuição de Produtos',
  data: [40, 25, 20, 10, 5], // contas correntes, poupança, cartões, empréstimos, investimentos
  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  borderWidth: 2,
};

export const doughnutDataset: ChartDataset<'doughnut'> = {
  type: 'doughnut',
  label: 'Distribuição de Produtos',
  data: [40, 25, 20, 10, 5],
  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
};

export const scatterDataset: ChartDataset<'scatter'> = {
  type: 'scatter',
  label: 'Saldo x Clientes',
  data: [
    { x: 2000, y: 150 },
    { x: 3000, y: 180 },
    { x: 1000, y: 120 },
  ],
  backgroundColor: '#36A2EB',
  pointRadius: 8,
};

export const bubbleDataset: ChartDataset<'bubble'> = {
  type: 'bubble',
  label: 'Transações x Clientes x Saldo',
  data: [
    { x: 1500, y: 120, r: 10 },
    { x: 2000, y: 180, r: 15 },
    { x: 1000, y: 100, r: 8 },
  ],
  backgroundColor: '#FFCE56',
};

export const radarDataset: ChartDataset<'radar'> = {
  type: 'radar',
  label: 'Agências',
  data: [80, 70, 90, 85, 75, 95], // atendimento, vendas, retenção, etc.
  borderColor: '#FF6384',
  backgroundColor: 'rgba(255, 99, 132, 0.2)',
  fill: true,
};

export const polarAreaDataset: ChartDataset<'polarArea'> = {
  type: 'polarArea',
  label: 'Volume de Transações',
  data: [5000, 3000, 2000, 1500, 1000], // depósito, saque, cartão, empréstimos, investimentos
  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
};

export const lineData: ChartData<'line'> = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [lineDataset2023, lineDataset2024],
};

export const barData: ChartData<'bar'> = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [barDataset2023, barDataset2024],
};

export const pieData: ChartData<'pie'> = {
  labels: [
    'Conta Corrente',
    'Poupança',
    'Cartão',
    'Empréstimo',
    'Investimento',
  ],
  datasets: [pieDataset],
};

export const doughnutData: ChartData<'doughnut'> = {
  labels: [
    'Conta Corrente',
    'Poupança',
    'Cartão',
    'Empréstimo',
    'Investimento',
  ],
  datasets: [doughnutDataset],
};

export const scatterData: ChartData<'scatter'> = {
  labels: [],
  datasets: [scatterDataset],
};

export const bubbleData: ChartData<'bubble'> = {
  labels: [],
  datasets: [bubbleDataset],
};

export const radarData: ChartData<'radar'> = {
  labels: [
    'Atendimento',
    'Vendas',
    'Retenção',
    'Lucro',
    'Satisfação',
    'Eficiência',
  ],
  datasets: [radarDataset],
};

export const polarAreaData: ChartData<'polarArea'> = {
  labels: ['Depósito', 'Saque', 'Cartão', 'Empréstimos', 'Investimentos'],
  datasets: [polarAreaDataset],
};
