# NOC Dashboard | Mission Control

Dashboard de produção operacional de alta performance projetado para rodar 24h em uma TV (Wallboard / NOC).

## 🚀 Como funciona

O dashboard consome um arquivo `JSON` externo. Para que a atualização automática funcione via Excel VBA:
1. O Excel VBA deve salvar o arquivo `data.json` na sua máquina local sincronizada com o GitHub (Pasta do Repositório).
2. O sistema de sincronização do GitHub (GitHub Desktop ou CLI) sobe o arquivo para o repositório.
3. O Dashboard lê a URL **RAW** do GitHub (Ex: `https://raw.githubusercontent.com/usuario/repo/main/public/data.json`).

## 📊 Estrutura do JSON (Excel VBA)

O dashboard foi ajustado para ler o formato padrão de exportação do seu Excel:
- **Praça/Empresa**: Coluna `PORTO ALEGRE`
- **HC**: Coluna `col_2`
- **P.U**: Coluna `col_3`
- **Altas**: Coluna `ALTAS`
- **Meta**: Coluna `col_25`
- **Eficácia**: Coluna `col_28` (valor decimal, ex: 0.68 para 68%)
- **GAP**: Coluna `col_24`

Certifique-se de que o seu VBA gere as chaves com esses nomes exatos.

## ⚙️ Tecnologias

- **Vite + React**
- **Vanilla CSS** (Foco em performance e controle visual)
- **Lucide React** (Ícones premium)
- **Framer Motion** (Animações suaves)
- **Polling System** (Atualização a cada 15-30s com cache-busting)

---
*Desenvolvido para operações de missão crítica.*
