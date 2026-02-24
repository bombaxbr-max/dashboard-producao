# NOC Dashboard | Mission Control

Dashboard de produção operacional de alta performance projetado para rodar 24h em uma TV (Wallboard / NOC).

## 🚀 Como funciona

O dashboard consome um arquivo `JSON` externo. Para que a atualização automática funcione via Excel VBA:
1. O Excel VBA deve salvar o arquivo `data.json` na sua máquina local sincronizada com o GitHub (Pasta do Repositório).
2. O sistema de sincronização do GitHub (GitHub Desktop ou CLI) sobe o arquivo para o repositório.
3. O Dashboard lê a URL **RAW** do GitHub (Ex: `https://raw.githubusercontent.com/usuario/repo/main/public/data.json`).

## 🛠️ Configuração de Produção

No arquivo `src/App.jsx`, altere a constante `JSON_URL`:

```javascript
// Local (Desenvolvimento)
const JSON_URL = '/data.json'; 

// Produção (URL RAW do GitHub)
const JSON_URL = 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/main/public/data.json';
```

## 📦 Deploy na Vercel

1. Crie um novo repositório no GitHub e suba este código.
2. Acesse [vercel.com](https://vercel.com) e conecte seu repositório.
3. Nas configurações de Build:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Clique em **Deploy**.

## 📺 Modo TV

- O dashboard possui **auto-scroll** lento na tabela principal.
- Clique no botão **Maximize** (canto superior direito) para entrar em Fullscreen.
- Se os dados não forem atualizados por mais de 10 minutos, um alerta visual vermelho piscará no topo.

## ⚙️ Tecnologias

- **Vite + React**
- **Vanilla CSS** (Foco em performance e controle visual)
- **Lucide React** (Ícones premium)
- **Framer Motion** (Animações suaves)
- **Polling System** (Atualização a cada 15-30s com cache-busting)

---
*Desenvolvido para operações de missão crítica.*
