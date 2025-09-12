# Documentação do Projeto

## Visão Geral
Este projeto é uma aplicação Angular estruturada com diversas funcionalidades, incluindo autenticação, layouts, componentes compartilhados e páginas específicas. Ele segue uma arquitetura modular para facilitar a escalabilidade e manutenção.

---

## Estrutura do Projeto

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

## Tecnologias Utilizadas

- **Angular**: Framework principal para desenvolvimento da aplicação.
- **TypeScript**: Linguagem utilizada para desenvolvimento.
- **SCSS**: Pré-processador CSS para estilização.
- **HTML**: Linguagem de marcação para estruturação das páginas.

---

## Requisitos de Sistema

- **Node.js**: Versão 16 ou superior.
- **NPM**: Versão 8 ou superior.
- **Angular CLI**: Versão 14 ou superior.

---

## Passos para Execução

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```

4. **Acesse a aplicação**:
   Abra o navegador e acesse `http://localhost:4200`.

---

## Estrutura Modular

- **Core**: Contém serviços, guardas e interceptadores.
- **Features**: Funcionalidades específicas da aplicação.
- **Shared**: Componentes e diretivas reutilizáveis.
- **Layouts**: Estruturas de layout da aplicação.
- **Styles**: Estilizações globais e tokens de design.

---

## Contato
Para dúvidas ou suporte, entre em contato com o desenvolvedor principal.
