export interface ApiResponse {
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
  solicitacoes: any[];
}

export interface TableData {
  data: any[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
