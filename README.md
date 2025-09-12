# 📘 Documentação Completa do Sistema

## Visão Geral

Este projeto é uma aplicação Angular estruturada com diversas funcionalidades, incluindo autenticação, layouts, componentes compartilhados e páginas específicas. Ele segue uma arquitetura modular para facilitar a escalabilidade e manutenção. Foi desenvolvido oriundo de um desafio da Pericia Forense do Estado do Ceará para concorrer a vaga de Desenvolvedor Pleno.

---

## 🔧 Tecnologias e Versões

- **Framework**: Angular Versão: 19.2.15
- **Node.js**: v23.3.0
- **NPM**:10.9.0
- **IDE**: VSCode

---

## 🛠️ Como Usar

### Pré-requisitos

- Instalar o [Node.js](https://nodejs.org/) (versão recomendada: v23.3.0 )
- Instalar o [Angular CLI](https://angular.io/cli) globalmente:

```bash
npm install -g @angular/cli
```

### Passos para Execução

1. **Clonar o Repositório**

````bash
git clone https://github.com/gustavor8/pefoce-challenge.git```
````

2. **Acessar o repósitorio**

```bash
cd pefoce-challenge
```

Se preferir pode abrir o projeto direto com a IDE.

3. **Instalar Dependências**

```bash
npm install
```


4. **Iniciar o Servidor de Desenvolvimento**
Para iniciar o servidor de desenvolvimento, execute o seguinte comando no seu terminal:

```bash
ng serve
```

5. **Acessar a Aplicação**
   Após iniciar o servidor, abra seu navegador e acesse a seguinte URL:

[http://localhost:4200/](http://localhost:4200/)

A aplicação será recarregada automaticamente sempre que você modificar os arquivos de origem.

---

6. **Iniciar o Servidor Back-end**

Irei deixar no projeto também o back-end, ressalvando que este não foi criado por mim, mas sim por Ênio Viana. Todas as intruções para o back-end são dadas através do arquivo do Insominia que está contemplado na pasta do supracitado servidor.

## 📁 Estrutura de Diretórios

Abaixo está a estrutura principal do projeto:

```
src/
├── index.html
├── main.ts
├── polyfills.ts
├── app/
│   ├── app.component.html
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── guards/
│   │   │   ├── authGuard/
│   │   │   │   ├── auth-guard.guard.spec.ts
│   │   │   │   ├── auth-guard.guard.ts
│   │   │   ├── is-login/
│   │   │       ├── is-login.guard.spec.ts
│   │   │       ├── is-login.guard.ts
│   │   ├── interceptors/
│   │   │   ├── token/
│   │   │       ├── token.interceptor.spec.ts
│   │   │       ├── token.interceptor.ts
│   │   ├── models/
│   │   │   ├── chart.models.ts
│   │   │   ├── solitacoes-api.ts
│   │   ├── services/
│   │       ├── auth/
│   │           ├── auth.service.spec.ts
│   │           ├── auth.service.ts
│   ├── features/
│   │   ├── erro-page/
│   │   │   ├── erro-page.component.html
│   │   │   ├── erro-page.component.scss
│   │   │   ├── erro-page.component.spec.ts
│   │   │   ├── erro-page.component.ts
│   │   ├── home/
│   │   │   ├── home.component.html
│   │   │   ├── home.component.scss
│   │   │   ├── home.component.spec.ts
│   │   │   ├── home.component.ts
│   │   ├── login-page/
│   │   │   ├── login.component.html
│   │   │   ├── login.component.scss
│   │   │   ├── login.component.ts
│   │   │   ├── login.routes.ts
│   │   ├── pericia/
│   │       ├── dashboard/
│   │       ├── pericia.routes.ts
│   │       ├── solicitacoes-page/
│   ├── layouts/
│   │   ├── baselayout/
│   │       ├── baselayout.component.html
│   │       ├── baselayout.component.scss
│   │       ├── baselayout.component.spec.ts
│   │       ├── baselayout.component.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── avatar/
│   │   │   ├── badge/
│   │   │   ├── button/
│   │   │   ├── chart/
│   │   │   ├── checkbox/
│   │   │   ├── dropdown/
│   │   │   ├── error-generic-page/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── icon/
│   │   │   ├── icon-button/
│   │   │   ├── loader/
│   │   │   ├── loading-overlay/
│   │   │   ├── menu/
│   │   │   ├── menu-item/
│   │   │   ├── pagination/
│   │   │   ├── popover/
│   │   │   ├── search-filters/
│   │   │   ├── tab/
│   │   │   ├── table/
│   │   │   ├── tabs/
│   │   │   ├── text-input/
│   │   ├── directives/
│   │       ├── popover-trigger.directive.ts
│   ├── styles/
│       ├── styles.scss
│       ├── functions/
│       │   ├── _rem.scss
│       ├── mixins/
│       │   ├── _shadow.scss
│       ├── tokens/
│           ├── _colors.scss
│           ├── _index.scss
│           ├── _variables.scss
├── assets/
│   ├── files/
│   │   ├── marker-icon-2x.png
│   │   ├── marker-icon.png
│   │   ├── marker-shadow.png
│   │   ├── teste2.kml
│   ├── fonts/
│   │   ├── Figtree/
│   │       ├── Figtree-Italic-VariableFont_wght.ttf
│   │       ├── Figtree-VariableFont_wght.ttf
│   │       ├── OFL.txt
│   │       ├── README.txt
│   ├── images/
│   │   ├── avatar-1.png
│   │   ├── avatar-2.png
│   │   ├── avatar-3.png
│   │   ├── avatar-4.png
│   │   ├── avatar-5.png
│   │   ├── logo-footer.png
│   │   ├── logo.png
│   │   ├── pefoce.png
│   │   ├── slide1.jpg
│   │   ├── slide2.jpg
│   │   ├── slide3.jpg
│   ├── svgs/
│       ├── logo-galileu-primary.svg
│       ├── logo-galileu.svg
```

---

## Estrutura Modular

- **Core**: Contém serviços, guards, modelos e interceptadores.
- **Features**: Funcionalidades específicas da aplicação.
- **Shared**: Componentes e diretivas reutilizáveis.
- **Layouts**: Estruturas de layout da aplicação.
- **Styles**: Estilizações globais e tokens de design.

---



## 🔄 Scripts Disponíveis

Você pode usar os seguintes scripts definidos no `package.json` com `npm run <script>` ou diretamente com `ng`:

- `ng serve`: Inicia o servidor de desenvolvimento.
- `ng lint`: Analisa o código em busca de problemas de estilo e erros.
- `ng build`: Compila a aplicação para um ambiente de produção. O resultado fica na pasta `dist/`.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 👤 Criado por

Gustavo Rodrigues
