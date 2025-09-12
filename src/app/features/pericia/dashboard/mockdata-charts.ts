import { ChartData, ChartDataset } from '../../../core/models/chart.models';

// DADOS DE LINHA: Evolução Mensal de Perícias
export const lineDatasetConcluidas: ChartDataset<'line'> = {
  type: 'line',
  label: 'Laudos Conluídos',
  data: [4, 5, 6, 8, 7, 6], // Dados fictícios para 6 meses
  borderColor: '#FF6384',
  backgroundColor: 'rgba(255, 99, 132, 0.2)',
  fill: true,
  borderWidth: 2,
  tension: 0.4,
};

export const lineDatasetEmAndamento: ChartDataset<'line'> = {
  type: 'line',
  label: 'Laudos Pendentes',
  data: [10, 8, 9, 7, 8, 8], // Dados fictícios para 6 meses
  borderColor: '#36A2EB',
  backgroundColor: 'rgba(54, 162, 235, 0.2)',
  fill: true,
  borderWidth: 2,
  tension: 0.4,
};

// DADOS DE BARRA: Status das Solicitações
export const barDatasetRecebidas: ChartDataset<'bar'> = {
  type: 'bar',
  label: 'Solicitações no Setor',
  data: [5, 7, 6, 8, 6, 9],
  borderColor: '#36A2EB',
  backgroundColor: 'rgba(54, 162, 235, 0.5)',
  borderWidth: 2,
};

export const barDatasetDistribuidas: ChartDataset<'bar'> = {
  type: 'bar',
  label: 'Solicitações Recebidas',
  data: [4, 6, 5, 7, 5, 7],
  borderColor: '#FF6384',
  backgroundColor: 'rgba(255, 99, 132, 0.5)',
  borderWidth: 2,
};

// DADOS DE PIZZA: Distribuição dos Laudos
export const pieDataset: ChartDataset<'pie'> = {
  type: 'pie',
  label: 'Distribuição de Laudos',
  data: [5, 3, 2, 3], // Laudos Pendentes, Laudos Para Revisão, Laudos para Correção, SVO - Laudos Pendentes
  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  borderWidth: 2,
};

// --- ESTRUTURAS DE DADOS PARA OS GRÁFICOS ---

export const lineData: ChartData<'line'> = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [lineDatasetConcluidas, lineDatasetEmAndamento],
};

export const barData: ChartData<'bar'> = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [barDatasetRecebidas, barDatasetDistribuidas],
};

export const pieData: ChartData<'pie'> = {
  labels: [
    'Laudos Pendentes',
    'Laudos Para Revisão',
    'Laudos para Correção',
    'SVO - Laudos Pendentes',
  ],
  datasets: [pieDataset],
};
