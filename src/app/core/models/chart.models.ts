import {
  ChartTypeRegistry,
  ScatterDataPoint,
  BubbleDataPoint,
  FontSpec,
} from 'chart.js';

export interface ChartDataset<
  T extends keyof ChartTypeRegistry = keyof ChartTypeRegistry
> {
  label: string;
  data: T extends 'scatter'
    ? ScatterDataPoint[]
    : T extends 'bubble'
    ? BubbleDataPoint[]
    : number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  type?: T;
  pointRadius?: number;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
    };
    title?: {
      display?: boolean;
      text?: string;
      font?: {
        size?: number;
        weight?: FontSpec['weight'];
      };
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: {
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      title?: {
        display?: boolean;
        text?: string;
      };
      beginAtZero?: boolean;
    };
  };
}

export interface ChartData<
  T extends keyof ChartTypeRegistry = keyof ChartTypeRegistry
> {
  labels?: string[];
  datasets: ChartDataset<T>[];
}

export type ChartSize = 'sm' | 'md' | 'lg' | 'auto';
export type ChartType = keyof ChartTypeRegistry;

export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  title?: string;
  size?: ChartSize;
  showLegend?: boolean;
  showTooltips?: boolean;
}
