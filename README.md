# 📺 TV do Yuri - Programação Educativa Personalizada

Uma aplicação web moderna construída com **Next.js 14** e **Tailwind CSS** para criar uma TV personalizada com conteúdo educativo selecionado para crianças de 3-4 anos.

## ✨ Características Principais

### ⚙️ Configurações Avançadas para Pais (NOVO)
- **Limite de Tempo Diário:** Defina o tempo máximo de tela por dia, com base em recomendações pedagógicas (padrão: 60 minutos).
- **Duração Máxima da Sessão:** Controle a duração de cada vídeo ou bloco de conteúdo para otimizar a atenção da criança (padrão: 15 minutos).
- **Priorização por Habilidades:** Selecione habilidades de desenvolvimento (Linguagem, Coordenação Motora, Cognitivo, Socioemocional, Criatividade) para que a programação priorize vídeos que as estimulem.
- **Categorias Permitidas:** Ative ou desative categorias de conteúdo (Desenhos, Clipes Educativos, Comerciais Educativos).
- **Controles Parentais:** Ative ou desative a pausa automática da reprodução ao atingir o limite de tempo diário.

### 🎯 Sistema Inteligente de Programação (Atualizado)
- **Geração Diária da Playlist:** Uma nova playlist é gerada a cada dia, considerando as configurações dos pais e as habilidades priorizadas.
- **Intercalação Aprimorada:** A lógica de intercalação entre conteúdos agora leva em conta as habilidades selecionadas, garantindo um desenvolvimento mais direcionado.
- **Controle de Tempo de Tela:** O sistema monitora o tempo de visualização e exibe um aviso quando o limite diário é atingido, pausando a reprodução se os controles parentais estiverem ativos.


### 🎯 Sistema Inteligente de Programação
- **Intercalação Automática**: Alterna automaticamente entre desenhos, clipes educativos e comerciais
- **Regras Educativas Inteligentes**:
  - Após cada episódio de desenho: 2 comerciais educativos
  - Depois dos comerciais: 1 clipe educativo
  - Volta para o próximo desenho
- **Variedade Garantida**: Evita repetição rápida do mesmo conteúdo
- **Playlist Dinâmica**: Gera novos vídeos conforme necessário

### 🎨 Design Moderno e Premium
- Interface sofisticada com gradientes e animações suaves
- Tema escuro otimizado para crianças
- Componentes com Framer Motion para transições elegantes
- Responsivo em todos os dispositivos
- Glass morphism e efeitos visuais modernos

### 📁 Organização por Pastas
- **Dragon Ball Z**: Série clássica com episódios
- **Patrulha Canina**: Aventuras educativas
- **Bluey**: Histórias de imaginação e família
- **Clipes Educativos**: Alfabeto, números, cores, formas, animais, higiene
- **Comerciais Educativos**: Frutas, exercício, sono, compartilhamento

### 🎮 Player Profissional
- Controles completos: play, pause, próximo, anterior
- Barra de progresso interativa
- Controle de volume com mute
- Fullscreen support
- Informações do vídeo em tempo real
- Controles que desaparecem automaticamente

### 👨‍👩‍👧 Interface Amigável para Crianças
- Design colorido e intuitivo
- Playlist visual com próximos vídeos
- Estatísticas de programação
- Dicas para pais
- Controles rápidos e acessíveis

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start
```

A aplicação estará disponível em `http://localhost:3000`

### Acessar e Configurar (NOVO)
1.  **Clique no ícone de engrenagem (⚙️)** no canto superior direito da tela para abrir o modal de configurações.
2.  **Ajuste os parâmetros** de limite de tempo, duração da sessão, habilidades priorizadas e categorias permitidas.
3.  **Clique em "Salvar"** para aplicar as configurações. A programação será ajustada automaticamente.

### Adicionar Seus Próprios Vídeos

#### 1. Estrutura de Pastas
Organize seus vídeos em `public/videos/`:

```
public/
├── videos/
│   ├── cartoons/
│   │   ├── dragon-ball-z/
│   │   │   ├── ep-001.mp4
│   │   │   ├── ep-002.mp4
│   │   │   └── ...
│   │   ├── paw-patrol/
│   │   │   ├── ep-001.mp4
│   │   │   └── ...
│   │   └── bluey/
│   │       ├── ep-001.mp4
│   │       └── ...
│   ├── educational/
│   │   ├── alphabet-song.mp4
│   │   ├── counting-1-10.mp4
│   │   ├── learning-colors.mp4
│   │   └── ...
│   └── commercials/
│       ├── healthy-fruits.mp4
│       ├── exercise-fun.mp4
│       └── ...
└── thumbnails/
    ├── dbz-001.jpg
    ├── paw-001.jpg
    └── ...
```

#### 2. Adicionar Metadados (Atualizado)
Edite `src/lib/mockData.ts` e certifique-se de incluir a nova propriedade `skills` para cada vídeo, que ajuda na priorização por habilidades:

```typescript
const cartoonVideos: Video[] = [
  {
    id: 'seu-video-001',
    title: 'Título do Seu Vídeo',
    category: 'cartoon', // ou 'educational_clip' ou 'commercial'
    duration: 1320, // em segundos
    ageRecommendation: '3-4',
    educationalValue: 'Valores educativos principais',
    url: '/videos/cartoons/seu-video/ep-001.mp4',
    thumbnail: '/thumbnails/seu-video-001.jpg',
    description: 'Descrição opcional do vídeo',
    skills: ['language', 'cognitive'], // Exemplo: habilidades que este vídeo desenvolve
  },
  // ... mais vídeos
];
```

#### 3. Atualizar Pastas
Adicione suas pastas em `videoFolders`:

```typescript
{
  id: 'cartoon-seu-video',
  name: 'Seu Vídeo',
  category: 'cartoon',
  videos: cartoonVideos.filter((v) => v.id.startsWith('seu')),
  description: 'Descrição do seu conteúdo',
  icon: '🎬', // Emoji opcional
}
```

## 📁 Estrutura do Projeto (Atualizado)

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página principal (agora integra o SettingsModal e a lógica de tempo)
│   └── globals.css         # Estilos globais
├── components/
│   ├── VideoPlayer.tsx     # Player de vídeo com controles
│   ├── Playlist.tsx        # Visualização da próxima programação
│   ├── CategorySelector.tsx # Seletor de categorias
│   └── SettingsModal.tsx   # NOVO: Modal de configurações para pais
├── hooks/
│   └── useTV.ts           # Hook para gerenciar estado da TV (atualizado para usar novas regras e controle de tempo)
├── lib/
│   ├── programmingRules.ts # Lógica de programação inteligente (básica)
│   ├── advancedProgrammingRules.ts # NOVO: Lógica de programação avançada com suporte a habilidades e limites
│   ├── mockData.ts         # Dados de exemplo (atualizado com a propriedade 'skills')
│   └── settingsManager.ts  # NOVO: Gerenciamento de configurações e estatísticas de uso
├── types/
│   └── index.ts           # Tipos TypeScript (atualizado com AppSettings, DailyUsageStats, SkillCategory)
└── styles/
    └── globals.css         # Estilos globais

public/
├── videos/                 # Seus vídeos aqui
└── thumbnails/            # Thumbnails dos vídeos
```

## 🎨 Personalização

### Cores e Temas
Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
    },
  },
}
```

### Regras de Programação (Atualizado)
Para ajustar a lógica de programação, agora você pode modificar `src/lib/advancedProgrammingRules.ts`. Este arquivo contém a lógica aprimorada que considera as configurações dos pais, habilidades priorizadas e limites de tempo. O arquivo `src/lib/programmingRules.ts` agora serve como base para a lógica mais simples.


### Animações
Customize animações em `src/styles/globals.css` e use Framer Motion nos componentes.

## 🛠️ Tecnologias

- **Next.js 14**: Framework React moderno
- **React 19**: UI library
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Estilização utilitária
- **Framer Motion**: Animações suaves
- **Lucide React**: Ícones modernos

## 👨‍👩‍👧 Para Pais

### Benefícios
✅ Conteúdo selecionado e seguro  
✅ Sem publicidade invasiva  
✅ Educativo e divertido  
✅ **Controle total da programação com configurações personalizáveis (NOVO)**
✅ **Programação adaptada às habilidades desejadas (NOVO)**
✅ Intercalação automática de conteúdo  
✅ Interface amigável para crianças  

### Recomendações (Atualizado)
- Crianças de 3-4 anos: **Máximo de 60 minutos de tela por dia**, com sessões de **15-20 minutos** [1, 2, 3, 4].
- Supervisão parental recomendada.
- Combine com outras atividades lúdicas e físicas.
- Use como ferramenta educativa complementar, não como substituto da interação humana.

## 📝 Notas Importantes

- Os vídeos são carregados do servidor local
- A playlist é gerada dinamicamente com base nas regras
- O player suporta pausa, play, próximo e anterior
- A programação continua gerando novos vídeos conforme necessário
- Use thumbnails de alta qualidade para melhor experiência visual

## 🐛 Troubleshooting

**Vídeos não aparecem:**
- Verifique se os arquivos estão em `/public/videos/`
- Confirme os caminhos em `src/lib/mockData.ts`
- Limpe o cache do navegador (Ctrl+Shift+Delete)

**Player não funciona:**
- Verifique se o servidor está rodando (`pnpm dev`)
- Tente atualizar a página (F5)
- Verifique o console do navegador para erros (F12)

**Programação não muda:**
- Verifique se `useTV.ts` está funcionando
- Confirme que `programmingRules.ts` está sendo usado
- Reinicie a aplicação

## 📦 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📄 Licença

Projeto educativo - Uso livre para fins pessoais e educacionais.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novos recursos
- Melhorar a documentação

---

**Desenvolvido com ❤️ para Yuri e todas as crianças**

Para dúvidas ou sugestões, abra uma issue ou entre em contato!

