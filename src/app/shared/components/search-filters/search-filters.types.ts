export interface SearchField {
  type: 'text' | 'dropdown';
  name: string;
  placeholder: string;
  maxLength?: number;
  options?: { value: any; label: string }[];
  required?: boolean;
}

export interface SearchType {
  value: string;
  label: string;
  fields: SearchField[];
}

export const searchTypes: SearchType[] = [
  {
    value: 'solicitacao',
    label: 'Solicitação',
    fields: [
      {
        type: 'text',
        name: 'numeroSolicitacao',
        placeholder: 'Nº de solicitação',
        required: true,
      },
    ],
  },
  {
    value: 'cadaver',
    label: 'Cádaver',
    fields: [
      {
        type: 'text',
        name: 'numeroPulseira',
        placeholder: 'Número da pulseira',
        required: true,
      },
    ],
  },
  {
    value: 'envolvido',
    label: 'Envolvido',
    fields: [
      {
        type: 'text',
        name: 'nomeCompleto',
        placeholder: 'Digite o nome completo',
        maxLength: 50,
        required: true,
      },
    ],
  },
  {
    value: 'guia',
    label: 'Guia',
    fields: [
      {
        type: 'dropdown',
        name: 'orgaoGuia',
        placeholder: 'Selecione o órgão',
        options: [
          { value: 'policia', label: 'Polícia' },
          { value: 'bombeiros', label: 'Bombeiros' },
          { value: 'outro', label: 'Outro' },
        ],
        required: true,
      },
      {
        type: 'text',
        name: 'numeroGuia',
        placeholder: 'Digite o número',
        required: true,
      },
      {
        type: 'text',
        name: 'anoGuia',
        placeholder: 'Digite o ano',
      },
    ],
  },
  {
    value: 'caso',
    label: 'Caso',
    fields: [
      {
        type: 'text',
        name: 'numeroCaso',
        placeholder: 'Digite o número',
        required: true,
      },
      {
        type: 'text',
        name: 'anoCaso',
        placeholder: 'Digite o ano',
      },
    ],
  },
  {
    value: 'oficio',
    label: 'Ofício',
    fields: [
      {
        type: 'dropdown',
        name: 'orgaoOficio',
        placeholder: 'Selecione o órgão',
        options: [
          { value: 'policia', label: 'Polícia' },
          { value: 'bombeiros', label: 'Bombeiros' },
          { value: 'outro', label: 'Outro' },
        ],
      },
      {
        type: 'text',
        name: 'numeroOficio',
        placeholder: 'Digite o número',
        required: true,
      },
      {
        type: 'text',
        name: 'anoOficio',
        placeholder: 'Digite o ano',
      },
    ],
  },
  {
    value: 'evidencia',
    label: 'Evidência',
    fields: [
      {
        type: 'text',
        name: 'numeroEvidencia',
        placeholder: 'Digite o número',
        required: true,
      },
    ],
  },
  {
    value: 'laudo',
    label: 'Laudo',
    fields: [
      {
        type: 'text',
        name: 'numeroLaudo',
        placeholder: 'Digite o número',
        required: true,
      },
    ],
  },
  {
    value: 'lote',
    label: 'Lote',
    fields: [
      {
        type: 'text',
        name: 'numeroLote',
        placeholder: 'Digite o número',
        required: true,
      },
    ],
  },
  {
    value: 'serieArma',
    label: 'Série Arma',
    fields: [
      {
        type: 'text',
        name: 'valorSerieArma',
        placeholder: 'Digite o valor',
        required: true,
      },
    ],
  },
  {
    value: 'lacre',
    label: 'Lacre',
    fields: [
      {
        type: 'text',
        name: 'valorLacre',
        placeholder: 'Digite o valor',
        required: true,
      },
    ],
  },
  {
    value: 'perito',
    label: 'Perito',
    fields: [
      {
        type: 'text',
        name: 'valorPerito',
        placeholder: 'Digite o valor',
        required: true,
      },
    ],
  },
];
