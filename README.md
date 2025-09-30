# 🛍️ Marketplace

Uma plataforma de e-commerce moderna construída com Next.js, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- **Catálogo de produtos** com busca e filtros
- **Sistema de carrinho** com sincronização em tempo real
- **Autenticação de usuários** com rotas protegidas
- **Interface responsiva** mobile-first
- **Checkout completo** com múltiplas etapas
- **Admin** com painel de gerenciamento dos produtos

## 🚀 Tecnologias

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Estado:** React Context, Hooks
- **Ícones:** Lucide React
- **Notificações:** Sonner

## 📦 Como executar

```bash
# Clone o repositório
git clone https://github.com/ErickBalbino/marketplace.git

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse
http://localhost:3000
```

## 🔧 Configuração

Crie um arquivo `.env.local`:

```env
API_BASE_URL=http://localhost:3001
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (admin)/           # Rotas administrativas
│   ├── (auth)/            # Autenticação (login/registro)
│   ├── (protected)/       # Rotas protegidas
│   ├── (public)/          # Rotas públicas
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
├── contexts/              # Contexts do React
│   ├── CartContext.tsx    # Gerenciamento do carrinho
│   └── FavoritesContext.tsx
├── hooks/                 # Custom hooks
├── lib/                   # Configurações e utilitários
├── services/              # Serviços e API calls
├── types/                 # Definições TypeScript
├── data/                  # Dados estáticos
│   ├── freight.ts         # Dados de frete
│   ├── reviews.ts         # Avaliações
│   └── slides.ts          # Slides e banners
└── tests/                 # Testes da aplicação
```

## 🎯 Principais Componentes

### Carrinho

- Estado global com atualizações otimistas
- Sincronização entre abas/navegadores
- Persistência de dados
- Loading states com feedback visual

### Autenticação

- Sistema baseado em cookies
- Rotas protegidas
- Verificação de sessão em tempo real

## 📱 Responsividade

- Design mobile-first
- Componentes adaptativos
- Navegação touch-friendly
- Otimização de performance

## 🔄 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Produção
npm run lint         # Análise de código
```

**Desenvolvido com 💙 usando Next.js e TypeScript**
