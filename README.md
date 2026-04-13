# Feira Plus+

Lista de compras por corredor para **Novo Atacarejo**, **Assaí** e **Atacadão**. Interface simples (tema escuro, tipos grandes), pensada em acessibilidade.

**Em resumo:** escolhe o mercado, digita os itens (o app interpreta quantidade e unidade), organiza por corredor, permite marcar o que já pegou, exportar em **TXT** ou **JPG** e ajustar corredores e palavras-chave por loja.

## Stack

React (JSX), Vite, Capacitor (Android). **Android Gradle Plugin 8.1.2.** Persistência via `localStorage` no bundle web; no host Cursor use `window.storage` se existir.

## Rodar e gerar APK

```bash
npm install
npm run dev          # desenvolvimento
npm run build
npx cap sync android
npx cap open android # Build → APK no Android Studio
```

Arquivo principal: `Feira PLUS+.jsx`. Entrada web: `src/main.jsx`. Logos dos mercados: `public/brands/`. Ícone do app / splash: `public/app-icon.png` e recursos em `android/app/src/main/res/`.

## Licença

[PolyForm Noncommercial 1.0.0](LICENSE) — sem uso comercial sem autorização.

## Autor

[@Bordercansado](https://github.com/Biieru)
