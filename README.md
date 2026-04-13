# Feira Plus+

**Sua lista de compras inteligente para atacados.**

Aplicativo focado em organizar sua lista de compras com base nos corredores do atacado que você está visitando. Desenvolvido pensando em acessibilidade e simplicidade para todos os públicos, especialmente pessoas 60+.

---

## Funcionalidades

- **Seleção de mercado** — Escolha entre Novo Atacarejo, Assaí Atacadista ou Atacadão antes de montar sua lista
- **Organização automática por corredor** — Itens são reordenados automaticamente conforme a disposição dos corredores do mercado selecionado
- **Formatação inteligente de itens** — Escreva de qualquer jeito (ex: `feijão carioca 2kg`, `3 leite`, `2 pacotes arroz`) e o app padroniza para `2kg - Feijão Carioca`, `3Un - Leite`, `2Pct - Arroz`
- **Sugestões baseadas no histórico** — O app aprende o que você costuma comprar e sugere itens conforme você digita
- **Marcador "Mais em conta"** — Checkbox com ícone verde (💲) para sinalizar que a marca não importa, só o melhor preço
- **Checkbox de progresso** — Risque itens à medida que coloca no carrinho
- **Exportação em TXT e Imagem** — Gere sua lista formatada para imprimir ou compartilhar
- **Configuração de corredores** — Personalize os corredores e palavras-chave de cada mercado
- **Dados persistentes** — Histórico e configurações são salvos entre sessões
- **Animações Matrix** — Transições de tela com efeito digital rain inspirado no filme Matrix
- **Interface acessível** — Fontes grandes, botões amplos, alto contraste (tema escuro)

## Mercados Suportados

| Mercado | Corredores Padrão | Personalizável |
|---|---|---|
| Novo Atacarejo | 8 corredores | SIM |
| Assaí Atacadista | 8 corredores | SIM |
| Atacadão | 8 corredores | SIM |

> Os corredores vêm pré-configurados com palavras-chave genéricas. O usuário deve personalizar conforme a unidade que frequenta.

## Como Usar

1. Abra o app e selecione o mercado que vai visitar
2. Digite os itens no campo de busca (ex: `2kg Feijão Carioca`)
3. Ative o marcador **"Mais em conta"** se quiser a opção mais barata
4. Os itens serão organizados automaticamente por corredor
5. No mercado, marque os itens conforme coloca no carrinho
6. Exporte a lista em TXT ou imagem para compartilhar

## Tecnologias

- **React** (JSX)
- **JavaScript ES6+**
- **CSS-in-JS** (inline styles)
- **Canvas API** (animação Matrix)
- **Storage API** (persistência de dados)

## Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/Biieru/feira-plus.git

# Entre na pasta
cd feira-plus

# Instale as dependências
npm install

# Rode em modo de desenvolvimento
npm run dev
```

## Converter para APK (Android)

O app pode ser convertido para APK usando **Capacitor**:

```bash
# Instale o Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Feira Plus+" com.bordercansado.feiraplus

# Adicione a plataforma Android
npm install @capacitor/android
npx cap add android

# Build do projeto e sincronização
npm run build
npx cap sync

# Abra no Android Studio para gerar o APK
npx cap open android
```

> No Android Studio: **Build → Generate Signed Bundle / APK → APK**

## Estrutura

```
feira-plus/
├── src/
│   └── feira-plus.jsx    # Componente principal do app
├── public/
├── package.json
└── README.md
```

## Design

- **Tema:** Dark mode com acentos em verde Matrix (#00FF41)
- **Tipografia:** Fontes grandes (17-22px) para acessibilidade
- **Público-alvo:** Pessoas 60+ com pouco letramento tecnológico
- **Princípios:** Botões grandes, fluxo linear, feedback visual claro

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença PolyForm Noncommercial 1.0.0 — uso comercial não é permitido sem autorização do autor. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Criado por **[@Bordercansado](https://github.com/Biieru)**

---

<p align="center">
  <strong>Feira Plus+</strong> — Fazendo sua feira render mais.
</p>
