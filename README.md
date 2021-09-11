# EC-MVP

## Setup by docker

### Step 1. setting config

```bash
# server config
cp ./default.config.toml ./config.toml
vim ./config.toml
# need set `host = "ec-db"`

# docker db config
cp ./docker/.default.env ./docker/.env
vim ./docker/.env
```

### Step.2 run docker as service

```bash
cd docker
docker-compose build
docker-compose up -d
```

### Step.3 test use swagger

open: http://127.0.0.1:3000/api-doc

## Setup

### Step 1. prepare mysql database server

### Step 2. setting config

```bash
# server config
cp ./default.config.toml ./config.toml
vim ./config.toml

# docker db config
cp ./docker/.default.env ./docker/.env
vim ./docker/.env
```

### Step 2. start server

```bash
npm start
```

or use `pm2`

```bash
pm2 start . -n weather-crawler
```

### Step.3 test use swagger

open: http://127.0.0.1:3000/api-doc
