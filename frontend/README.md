# Loja de Livros Cristãos - Pastor Iraquitan Tunoda

Uma página de vendas completa e profissional para livros cristãos do Pastor Iraquitan Tunoda, missionário que dedicou mais de 20 anos propagando o evangelho no Japão. Desenvolvida com Next.js 16, App Router, Tailwind CSS e funcionalidades avançadas de e-commerce.

## 🎯 Objetivo

Criar uma experiência que transmita **paz**, **fé**, **esperança**, **confiança** e **alegria** através de um design limpo, emocional e focado em conversão, apresentando a trajetória única do Pastor Iraquitan Tunoda como missionário internacional.

## 👨‍🏫 Sobre o Pastor Iraquitan Tunoda

**Pastor Missionário e Escritor** com trajetória inspiradora:

- ✅ **25+ anos de ministério cristão**
- ✅ **20+ anos como missionário no Japão**
- ✅ **50k+ vidas impactadas**
- ✅ **12 livros publicados**
- ✅ Perspectiva intercultural única adquirida no Oriente
- ✅ Instagram: [@iraquitantunoda](https://www.instagram.com/iraquitantunoda/)

## 🎨 Design e Cores

### Paleta de Cores Cristã

- **Azul principal**: `#2F5D8C` - Transmite confiança e serenidade
- **Verde secundário**: `#3A7D44` - Representa esperança e crescimento
- **Dourado (CTA)**: `#C9A44C` - Destaca ações importantes
- **Background**: `#F7F6F2` - Suavidade e elegância
- **Texto**: `#2E2E2E` - Legibilidade otimizada

### Tipografia

- **Títulos**: Playfair Display (elegante e impactante)
- **Texto**: Inter (legibilidade e clareza)

## 🏗️ Funcionalidades Implementadas

### ✅ **Navegação Funcional**

- Menu fixo com scroll suave para seções
- **Início** → Hero Section
- **Livros** → Seção de produtos
- **Sobre** → História do pastor
- Carrinho com contador de itens
- Design responsivo com menu mobile

### ✅ **Seção Hero Refinada**

- Layout responsivo (2 colunas desktop, empilhado mobile)
- Foto real do Pastor Iraquitan Tunoda
- Botão "Adquirir livros" com scroll suave funcional
- Animações sutis de entrada
- Headline emocional impactante

### ✅ **Catálogo de Livros**

- **6 livros** com layout em grid responsivo
- Fotos reais das capas
- Descrições inspiradoras
- Preços formatados em R$
- Botão "Adicionar ao carrinho" com feedback visual
- Hover effects e animações elegantes

### ✅ **Sistema de Carrinho Completo**

- **Context API** para gerenciamento global de estado
- Adição/remoção de itens
- Controle de quantidade
- Cálculo automático de totais
- Persistência durante navegação

### ✅ **Página do Carrinho (/cart)**

- Lista completa dos itens
- Gerenciamento de quantidades
- Resumo financeiro detalhado
- Benefícios destacados (frete grátis, etc.)
- Estado vazio com CTA para compras

### ✅ **Página de Checkout (/checkout)**

- Formulário completo de dados pessoais
- Informações de entrega
- Resumo do pedido
- Indicadores de segurança
- Estrutura preparada para integração de pagamento

### ✅ **Seção Sobre o Autor**

- História completa do Pastor Iraquitan
- Experiência missionária no Japão destacada
- Estatísticas impressionantes
- Valores cristãos em destaque
- Links para redes sociais
- Animações baseadas em scroll

### ✅ **Imagens Reais**

- Fotos autênticas do Pastor Iraquitan Tunoda
- Capas personalizadas dos livros
- Otimização de carregamento (lazy loading)
- Responsividade em todos os breakpoints

## 🚀 Como executar

```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd loja-tunoda

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Acessar no navegador
http://localhost:3000

# Build para produção
npm run build
npm start
```

## 📱 Características Técnicas

### **Responsividade Total**

- **Mobile-first** approach
- Breakpoints otimizados
- Menu hamburger funcional
- Grid adaptativo para livros
- Imagens responsivas

### **Performance Otimizada**

- Next.js 16 com Turbopack
- Fontes Google otimizadas (`display: 'swap'`)
- Lazy loading de imagens
- Build otimizado para produção
- Carregamento progressivo

### **Acessibilidade (A11y)**

- ARIA labels descritivos
- Alt texts detalhados
- Focus states bem definidos
- Contraste adequado (WCAG)
- Navegação por teclado
- Reduced motion support

### **SEO Otimizado**

- Meta tags completas
- HTML semântico
- Structured data ready
- Lang="pt-BR"
- URLs amigáveis

## 🛒 Fluxo de Compra

1. **Navegação** → Usuário explora a página
2. **Seleção** → Adiciona livros ao carrinho
3. **Carrinho** → Revisa itens e quantidades
4. **Checkout** → Preenche dados de entrega
5. **Pagamento** → [Preparado para integração]

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz + CartProvider
│   ├── page.tsx           # Página principal completa
│   ├── cart/page.tsx      # Página do carrinho
│   ├── checkout/page.tsx  # Página de checkout
│   └── globals.css        # Estilos globais
├── components/
│   ├── Hero.tsx           # Seção hero com scroll suave
│   ├── Navigation.tsx     # Menu com carrinho
│   ├── Books.tsx          # Catálogo de livros
│   └── About.tsx          # História do pastor
├── contexts/
│   └── CartContext.tsx    # Gerenciamento de estado
└── public/
    └── img/               # Fotos reais do pastor e livros
```

## 🎯 Diferenciais do Projeto

### **Autenticidade**

- História real do Pastor Iraquitan Tunoda
- Experiência missionária no Japão
- Fotos autênticas
- Valores cristãos genuínos

### **Experiência do Usuário**

- Navegação intuitiva
- Feedback visual imediato
- Animações sutis e elegantes
- Design emocional inspirador

### **Funcionalidade Completa**

- Carrinho de compras funcional
- Múltiplas páginas integradas
- Estado persistente
- Pronto para pagamento

### **Código Profissional**

- TypeScript completo
- Context API para estado global
- Componentes reutilizáveis
- Arquitetura escalável

## 🔮 Próximos Passos

- [ ] Integração com Mercado Pago
- [ ] Sistema de autenticação
- [ ] Painel administrativo
- [ ] Newsletter/email marketing
- [ ] Blog integrado
- [ ] Sistema de avaliações

---

**Status**: ✅ **Projeto 100% funcional e profissional**

Uma página de vendas completa que honra a trajetória do Pastor Iraquitan Tunoda como missionário no Japão, oferecendo uma experiência de compra moderna e inspiradora para seus livros cristãos.
