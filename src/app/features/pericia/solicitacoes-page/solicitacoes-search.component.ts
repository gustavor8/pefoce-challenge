import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchFiltersComponent } from '../../../shared/components/search-filters/search-filters.component';
import {
  TableAction,
  TableColumn,
  TableComponent,
  TableConfig,
} from '../../../shared/components/table/table.component';
import { Subject, takeUntil } from 'rxjs';
import { SolicitacoesService } from '../../../core/services/solicitacoes/solicitacoes.service';
import { TableData } from '../../../core/models/solitacoes-api';
import { CARD_MAPPING, CardData } from './card-mapping';
import { StatisticsService } from '../../../core/services/statistics/statistics.service';
import { TagCardComponent } from '../../../shared/components/tag-card/tag-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitacoes-search',
  imports: [
    SearchFiltersComponent,
    TableComponent,
    TagCardComponent,
    CommonModule,
  ],
  templateUrl: './solicitacoes-search.component.html',
  styleUrl: './solicitacoes-search.component.scss',
})
export class SolicitacoesSearchComponent implements OnInit, OnDestroy {
  data: any[] = [];
  actions: TableAction[] = [];
  config!: TableConfig;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  loading = false;
  columns: TableColumn[] = [
    {
      key: 'numero_protocolo',
      label: 'Protocolo',
      sortable: false,
      visible: true,
      width: '120px',
    },
    {
      key: 'data',
      label: 'Data',
      sortable: true,
      visible: true,
      width: '100px',
    },
    {
      key: 'hora',
      label: 'Hora',
      sortable: false,
      visible: true,
      width: '80px',
    },
    {
      key: 'delegacia',
      label: 'Delegacia',
      sortable: false,
      visible: true,
      width: '150px',
    },
    {
      key: 'cidade',
      label: 'Cidade',
      sortable: true,
      visible: true,
      width: '120px',
    },
    {
      key: 'tipo_ocorrencia',
      label: 'Tipo Ocorrência',
      sortable: true,
      visible: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      visible: true,
    },
    {
      key: 'observacoes',
      label: 'Observações',
      sortable: false,
      visible: true,
    },
    {
      key: 'created_at',
      label: 'Criado em',
      sortable: false,
      visible: false,
    },
  ];

  private destroy$ = new Subject<void>();
  private statisticsService = inject(StatisticsService);
  private solicitacoesService = inject(SolicitacoesService);

  cards: CardData[] = [];
  statisticsData: any = {};
  cardsLoading: boolean = false;

  ngOnInit(): void {
    this.loadData();
    this.loadStatistics();
  }

  loadData(page: number = 1, itemsPerPage: number = 10): void {
    this.loading = true;
    this.solicitacoesService
      .getTableData(page, itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tableData: TableData) => {
          this.data = tableData.data;
          this.totalItems = tableData.totalItems;
          this.currentPage = tableData.currentPage;
          this.itemsPerPage = tableData.itemsPerPage;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
          this.loading = false;
        },
      });
  }

  loadStatistics(): void {
    this.cardsLoading = true;
    this.statisticsService
      .getStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats: any) => {
          this.statisticsData = stats.statistics || {};
          this.mapStatisticsToCards();
          this.cardsLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar estatísticas:', err);
          this.statisticsData = {};
          this.cardsLoading = false;
        },
      });
  }

  mapStatisticsToCards(): void {
    if (!this.statisticsData) {
      this.statisticsData = {};
    }

    this.cards = Object.entries(this.statisticsData).map(([key, quantity]) => {
      const mapping = CARD_MAPPING[key] || {
        iconClass: 'fas fa-question-circle',
        bgColor: 'bg-secondary',
        title: key,
      };

      return {
        key: key,
        title: mapping.title,
        quantity: quantity as number,
        iconClass: mapping.iconClass,
        bgColor: mapping.bgColor,
      };
    });
  }

  onPageChange(event: { page: number; itemsPerPage: number }): void {
    this.loadData(event.page, event.itemsPerPage);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
