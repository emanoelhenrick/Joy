<p align="center">
	<img src="src/assets/icons/icon.png" alt="Joy Client" width="112" />
</p>

<h1 align="center">Joy Client</h1>

<p align="center">
	<strong>Seu catálogo de entretenimento, organizado em um só lugar.</strong><br />
	Cliente desktop para playlists Xtream, construído com Electron, React e TypeScript.
</p>

<p align="center">
	<img src="https://img.shields.io/badge/status-em%20desenvolvimento-e8a317?style=for-the-badge" alt="Status: em desenvolvimento" />
	<img src="https://img.shields.io/badge/Electron-30-47848f?style=for-the-badge&logo=electron&logoColor=white" alt="Electron 30" />
	<img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=111827" alt="React 18" />
	<img src="https://img.shields.io/badge/TypeScript-5.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.2" />
</p>

## Sobre o projeto

O Joy Client é um aplicativo desktop para consumir playlists compatíveis com a **Xtream API**. Ele transforma uma lista de canais e conteúdos em uma experiência organizada, com navegação por categorias, informações enriquecidas e reprodução integrada ao VLC.

O projeto está em desenvolvimento ativo. A interface e os fluxos principais já estão estruturados, mas ainda podem sofrer mudanças entre versões.

## O que já existe

| Área | Recursos |
| --- | --- |
| **Catálogo** | Filmes, séries, episódios e canais ao vivo separados por categorias |
| **Descoberta** | Busca, destaques e tendências enriquecidas com dados do TMDB |
| **Playlists** | Adição, edição, atualização e remoção de playlists Xtream |
| **Perfis** | Criação, troca, renomeação e remoção de perfis locais |
| **Reprodução** | Abertura de conteúdo no VLC, tela cheia e retomada a partir do tempo salvo |
| **Experiência** | Dashboard, capas, avaliações e detalhes do conteúdo |

## Stack

- **Desktop:** Electron + Electron Forge
- **Frontend:** React 18, React Router e Tailwind CSS
- **Linguagem:** TypeScript
- **Estado e dados:** Zustand, TanStack Query e Axios
- **Metadados:** TMDB API
- **Player externo:** VLC Media Player
- **Build:** Vite

## Requisitos

- Node.js 18 ou superior
- npm
- VLC Media Player instalado no sistema
- Uma conta/provedor com acesso a uma playlist compatível com a Xtream API
- Uma chave de API do [TMDB](https://www.themoviedb.org/settings/api)

## Começando

### 1. Clone e instale as dependências

```bash
git clone <url-do-repositorio>
cd Joy
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_TMDB_API_KEY=sua_chave_tmdb
```

A chave é usada para buscar capas, informações de filmes e séries e a seção de tendências.

### 3. Inicie o aplicativo

```bash
npm run start
```

Na primeira execução, informe no Joy o nome da playlist, usuário, senha e a URL base fornecida pelo seu provedor. O aplicativo validará o acesso e baixará os catálogos de VOD, séries e canais ao vivo.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run start` | Inicia o aplicativo Electron em modo de desenvolvimento |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Compila o renderer e gera os pacotes da aplicação |
| `npm run package` | Empacota a aplicação sem criar instaladores |
| `npm run make` | Gera os instaladores disponíveis no Electron Forge |
| `npm run preview` | Serve uma prévia do build do Vite |

## Estrutura do projeto

```text
.
├── electron/       # Processo principal, IPC e serviços locais
│   └── core/       # Playlists, usuários, TMDB e integração com VLC
├── src/             # Interface React e páginas do aplicativo
│   ├── components/ # Componentes reutilizáveis e UI
│   ├── pages/      # Home, dashboard, live e configurações
│   ├── states/     # Estado compartilhado da aplicação
│   └── config/     # API exposta pelo preload do Electron
├── public/          # Ícones e arquivos públicos
└── forge.config.cjs # Configuração de empacotamento
```

## Distribuição

O projeto usa o Electron Forge. O comando abaixo executa o build completo e gera os artefatos configurados para a plataforma atual:

```bash
npm run build
```

Atualmente, a configuração inclui makers para **Windows (Squirrel)** e **Linux (Flatpak)**. A disponibilidade final depende do sistema operacional e das ferramentas de empacotamento instaladas.

## Privacidade e responsabilidade

O Joy Client é apenas um cliente para serviços compatíveis com a Xtream API. Você é responsável por utilizar playlists, credenciais e conteúdos aos quais tenha autorização de acesso. As credenciais são usadas para conectar o aplicativo ao serviço informado durante a configuração.

## Licença

O pacote declara licença `UNLICENSED`. Consulte o autor antes de redistribuir ou utilizar este projeto em outro contexto.