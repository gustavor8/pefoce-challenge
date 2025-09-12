export interface CardData {
  title: string;
  quantity: number;
  iconClass: string;
  bgColor: string; // cor em hexadecimal
  key: string;
}

export const CARD_MAPPING: {
  [key: string]: { iconClass: string; bgColor: string; title: string };
} = {
  'Novas Solicitações': {
    iconClass: 'bi bi-plus-circle',
    bgColor: '#0d6efd', // azul escuro
    title: 'Novas Solicitações',
  },
  'Solicitações Recebidas': {
    iconClass: 'bi bi-inbox',
    bgColor: '#3dc5ff', // azul claro
    title: 'Solicitações Recebidas',
  },
  'Solicitações Distribuidas': {
    iconClass: 'bi bi-list-task',
    bgColor: '#ffc107', // amarelo
    title: 'Solicitações Distribuídas',
  },
  'Recebidas por Perito': {
    iconClass: 'bi bi-person-badge',
    bgColor: '#198754', // verde escuro
    title: 'Recebidas por Perito',
  },
  'Perícias Em Andamento': {
    iconClass: 'bi bi-arrow-repeat',
    bgColor: '#6c757d', // cinza escuro
    title: 'Perícias Em Andamento',
  },
  'Perícias Concluídas': {
    iconClass: 'bi bi-check-circle',
    bgColor: '#20c997', // verde claro
    title: 'Perícias Concluídas',
  },
  'Laudos Pendentes': {
    iconClass: 'bi bi-clock',
    bgColor: '#fd7e14', // laranja
    title: 'Laudos Pendentes',
  },
  'Laudos Para Revisão': {
    iconClass: 'bi bi-eye',
    bgColor: '#FF5F15', // laranja
    title: 'Laudos Para Revisão',
  },
  'Laudos para Correção': {
    iconClass: 'bi bi-exclamation-triangle',
    bgColor: '#dc3545', // vermelho
    title: 'Laudos Para Correção',
  },
  'SVO - Laudos Pendentes': {
    iconClass: 'bi bi-file-medical',
    bgColor: '#adb5bd', // cinza médio
    title: 'SVO - Laudos Pendentes',
  },
  'Solicitações Devolvidas': {
    iconClass: 'bi bi-arrow-counterclockwise',
    bgColor: '#e03131', // vermelho escuro
    title: 'Solicitações Devolvidas',
  },
  'Solicitações Pausadas': {
    iconClass: 'bi bi-pause-circle',
    bgColor: '#495057', // cinza médio escuro
    title: 'Solicitações Pausadas',
  },
  'Pendentes de envio ao SIP': {
    iconClass: 'bi bi-send',
    bgColor: '#0dcaf0', // azul claro
    title: 'Pendentes de envio ao SIP',
  },
  'Enviados ao SIP': {
    iconClass: 'bi bi-check-lg',
    bgColor: '#198754', // verde escuro
    title: 'Enviados ao SIP',
  },
  'Não Pertencem ao SIP': {
    iconClass: 'bi bi-x-circle',
    bgColor: '#c92a2a', // vermelho médio
    title: 'Não Pertencem ao SIP',
  },
  'Em custódia do Núcleo': {
    iconClass: 'bi bi-shield-lock',
    bgColor: '#0d6efd', // azul escuro
    title: 'Em custódia do Núcleo',
  },
  Cobrança: {
    iconClass: 'bi bi-cash-stack',
    bgColor: '#fd7e14', // laranja
    title: 'Cobrança',
  },
};
