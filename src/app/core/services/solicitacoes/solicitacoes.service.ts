// services/table-data.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  TableColumn,
  TableConfig,
  TableAction,
} from '../../../shared/components/table/table.component';
import { ApiResponse, TableData } from '../../models/solitacoes-api';

@Injectable({
  providedIn: 'root',
})
export class SolicitacoesService {
  private apiUrl = 'http://localhost:5000/api/solicitacoes';

  private http = inject(HttpClient);
  getTableData(
    page: number = 1,
    itemsPerPage: number = 10
  ): Observable<TableData> {
    const params = {
      page: page.toString(),
      per_page: itemsPerPage.toString(),
    };

    return this.http
      .get<ApiResponse>(this.apiUrl, { params })
      .pipe(map((response) => this.mapApiResponseToTableData(response)));
  }

  private mapApiResponseToTableData(response: ApiResponse): TableData {
    return {
      data: response.solicitacoes,
      totalItems: response.pagination.total,
      currentPage: response.pagination.page,
      totalPages: response.pagination.pages,
      itemsPerPage: response.pagination.per_page,
    };
  }
}
