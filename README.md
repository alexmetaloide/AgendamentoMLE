# Agendamentos Master League Elite

Sistema de agendamento de partidas para EA FC 26, com autenticação Firebase e gerenciamento inteligente de horários.

## 🚀 Deploy

A aplicação está disponível online em: **https://[seu-usuario].github.io/agendamentos-master-league-elite/**

### Deploy Automático

O deploy é feito automaticamente via GitHub Actions sempre que há push para a branch `main`. O workflow:
1. Instala as dependências
2. Injeta as variáveis de ambiente do Firebase
3. Faz o build da aplicação
4. Publica no GitHub Pages

### Configurar GitHub Secrets

Para que o deploy funcione, configure os seguintes secrets no repositório GitHub (Settings → Secrets and variables → Actions → New repository secret):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `GEMINI_API_KEY`

Os valores devem ser copiados do seu arquivo `.env.local`.

### Configurar Firebase

No [Firebase Console](https://console.firebase.google.com/):
1. Vá em **Authentication → Settings → Authorized domains**
2. Adicione: `[seu-usuario].github.io`

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais do Firebase
```

### Executar localmente

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 📋 Funcionalidades

- ✅ Autenticação com Firebase (email/senha)
- ✅ Gerenciamento de adversários
- ✅ Agendamento de partidas com múltiplos horários
- ✅ Geração de mensagens para WhatsApp
- ✅ Interface responsiva e moderna

## 🔧 Tecnologias

- React 19
- TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Lucide React (ícones)
