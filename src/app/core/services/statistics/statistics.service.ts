import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DashboardStats {
  statistics: {
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:5000/api/dashboard/stats';

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<DashboardStats> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((response) => this.transformResponse(response)));
  }

  private transformResponse(response: any): DashboardStats {
    if (response.statistics) {
      return response;
    } else {
      return {
        statistics: {
          Cobrança: response.cobranca || response.Cobrança || 0,
          'Em custódia do Núcleo':
            response.custodia_nucleo || response['Em custódia do Núcleo'] || 0,
          'Enviados ao SIP':
            response.enviados_sip || response['Enviados ao SIP'] || 0,
          'Laudos Para Revisão':
            response.laudos_revisao || response['Laudos Para Revisão'] || 0,
          'Laudos Pendentes':
            response.laudos_pendentes || response['Laudos Pendentes'] || 0,
          'Laudos para Correção':
            response.laudos_correcao || response['Laudos para Correção'] || 0,
          'Novas Solicitações':
            response.novas_solicitacoes || response['Novas Solicitações'] || 0,
          'Não Pertencem ao SIP':
            response.nao_pertencem_sip || response['Não Pertencem ao SIP'] || 0,
          'Pendentes de envio ao SIP':
            response.pendentes_envio_sip ||
            response['Pendentes de envio ao SIP'] ||
            0,
          'Perícias Concluídas':
            response.pericias_concluidas ||
            response['Perícias Concluídas'] ||
            0,
          'Perícias Em Andamento':
            response.pericias_andamento ||
            response['Perícias Em Andamento'] ||
            0,
          'Recebidas por Perito':
            response.recebidas_perito || response['Recebidas por Perito'] || 0,
          'SVO - Laudos Pendentes':
            response.svo_laudos_pendentes ||
            response['SVO - Laudos Pendentes'] ||
            0,
          'Solicitações Devolvidas':
            response.solicitacoes_devolvidas ||
            response['Solicitações Devolvidas'] ||
            0,
          'Solicitações Distribuidas':
            response.solicitacoes_distribuidas ||
            response['Solicitações Distribuidas'] ||
            0,
          'Solicitações Pausadas':
            response.solicitacoes_pausadas ||
            response['Solicitações Pausadas'] ||
            0,
          'Solicitações Recebidas':
            response.solicitacoes_recebidas ||
            response['Solicitações Recebidas'] ||
            0,
        },
      };
    }
  }
}
