---
tags:
  - projeto/premodern-bh
  - indice
---

# Liga Premodern Beagá — Mapa do Projeto

## Visão Geral
Site institucional + ranking online da **Liga Premodern Beagá**, comunidade de jogadores de Magic: The Gathering no formato Premodern em Belo Horizonte. Visual inspirado no **old frame** das cartas (1995–2003), com landing page contando o que é o formato e a liga, e ranking dinâmico consumindo mockup JSON (S1) → Supabase (S2).

## Stack
- **Front:** React 18 + TypeScript + Vite + Tailwind + React Router
- **Tipografia:** Cinzel (títulos) + EB Garamond (corpo)
- **Ícones:** lucide-react
- **Data layer (S1):** JSON local
- **BaaS (S2):** Supabase (Postgres + Storage + Auth)
- **Deploy:** Vercel
- **Dominio:** a definir

## Sprints

- [[PremodernBH-S1]] — **Scaffold + landing + ranking com mockup JSON** (✅ concluída em 14/04/2026)
- *S2 (planejada):* Integração Supabase + páginas de Notícias e Calendário + painel admin

## Documentos de apoio
- [[arquitetura-S1]] — diagramas Mermaid, schema SQL Supabase, paleta completa, estrutura de pastas

## Links

- **Site em produção:** https://site-premodern-bh.vercel.app/
- **Repositório:** https://github.com/guilhermepatrick/site-premodern-bh
- **Instagram da liga:** https://www.instagram.com/premodernbeaga/
- **Local oficial:** Vault of Cards — Belo Horizonte/MG
- **Sobre Premodern (oficial):** https://premodernmagic.com/

## Identidade visual (old frame)

| Cor | Hex | Uso |
|---|---|---|
| Verde musgo | `#5C7A3E` | Primária (logo, botões) |
| Pergaminho | `#E8DCC0` | Textbox / fundo de cartas |
| Marrom moldura | `#8B6F47` | Borda lateral old frame |
| Dourado selo | `#C9A961` | Destaques Top 8, badges |
| Preto-grafite | `#1A1613` | Fundo do site |
| Off-white | `#F5EFD8` | Texto sobre fundo escuro |

---
*Gerado pelo Sistema Operacional Guizao*
