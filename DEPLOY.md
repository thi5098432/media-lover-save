# SaveClip - Deploy Independente

Aplicação de download de mídias pronta para deploy em VPS com EasyPanel/Docker.

## Requisitos

- **Node.js** 20+
- **PostgreSQL** 16+ (opcional - para analytics)
- **Redis** 7+ (opcional - para cache)
- **Docker** e **Docker Compose**

## Estrutura do Projeto

```
├── Dockerfile              # Build otimizado multi-stage
├── docker-compose.yml      # Orquestração dos serviços
├── nginx.conf              # Config nginx com rate limiting
├── .env.example            # Template de variáveis
├── migrations/             # Scripts SQL
│   └── 001_initial.sql
├── server/                 # Backend Express.js
│   ├── index.js
│   ├── package.json
│   └── routes/
│       ├── analyze-media.js
│       ├── download-media.js
│       ├── youtube-download.js
│       ├── stream-media.js
│       ├── scrape-colaboraread.js
│       ├── download-hls.js
│       ├── sitemap.js
│       └── health.js
└── src/                    # Frontend React (Vite)
```

## Configuração Rápida

### 1. Clone e configure variáveis

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
nano .env
```

Variáveis importantes:
```env
POSTGRES_PASSWORD=senha_segura_aqui
DATABASE_URL=postgresql://postgres:senha_segura@db:5432/saveclip
BASE_URL=https://seudominio.com
```

### 2. Build e deploy com Docker

```bash
# Build e iniciar todos os serviços
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down
```

### 3. (Opcional) Rodar migrations

Se estiver usando PostgreSQL para analytics:

```bash
docker-compose exec db psql -U postgres -d saveclip -f /docker-entrypoint-initdb.d/001_initial.sql
```

## Desenvolvimento Local

### Sem Docker

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd server && npm install && cd ..

# Rodar em desenvolvimento
npm run dev           # Frontend (porta 5173)
npm run server:dev    # Backend (porta 3000)
```

### Com Docker

```bash
docker-compose up --build
```

## Portas Utilizadas

| Serviço    | Porta |
|------------|-------|
| App (API)  | 3000  |
| PostgreSQL | 5432  |
| Redis      | 6379  |

## Deploy no EasyPanel

1. **Criar novo projeto** no EasyPanel
2. **Source**: Apontar para repositório Git
3. **Build**: Usar Dockerfile
4. **Variáveis**: Configurar todas do `.env.example`
5. **Rede**: Configurar domínio e SSL

### Usar PostgreSQL/Redis existentes

Se já tiver PostgreSQL e Redis na VPS:

```env
DATABASE_URL=postgresql://usuario:senha@ip_postgres:5432/saveclip
REDIS_URL=redis://ip_redis:6379
```

E remova os serviços `db` e `redis` do `docker-compose.yml`.

## API Endpoints

| Método | Endpoint                  | Descrição                    |
|--------|---------------------------|------------------------------|
| GET    | `/api/health`             | Health check                 |
| POST   | `/api/analyze-media`      | Analisa URL de mídia         |
| POST   | `/api/download-media`     | Obtém link de download       |
| POST   | `/api/youtube-download`   | Download específico YouTube  |
| POST   | `/api/stream-media`       | Proxy para streaming         |
| POST   | `/api/scrape-colaboraread`| Scrape de vídeos Colaboraread|
| POST   | `/api/download-hls`       | Download de streams HLS      |
| GET    | `/sitemap.xml`            | Sitemap dinâmico             |

## Scripts NPM

```json
{
  "build": "vite build",
  "start:prod": "node server/index.js",
  "dev": "vite",
  "server:dev": "node --watch server/index.js"
}
```

## Monitoramento

### Logs

```bash
# Ver logs do app
docker-compose logs -f app

# Ver logs do banco
docker-compose logs -f db
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## Troubleshooting

### Erro de conexão com banco

Verifique se o PostgreSQL está rodando:
```bash
docker-compose ps
docker-compose logs db
```

### Downloads falhando

1. Verifique os logs: `docker-compose logs -f app`
2. As APIs externas (Cobalt, Invidious) podem estar instáveis
3. Tente novamente após alguns minutos

### Rate limiting

O nginx está configurado com:
- 30 requests/minuto para API geral
- 10 requests/minuto para downloads

Ajuste em `nginx.conf` se necessário.

## Licença

MIT
