# [Bot Ticket (Discord.js v14.15.3)](https://github.com/marquezzx/bot-ticket-free)

Utilizando a base [Constatic](https://constatic-docs.vercel.app/pt) e [MongoDB](https://www.mongodb.com/)

### Linguagem utilizada

Este projeto foi desenvolvido inteiramente em **TypeScript**, porém variaveis de ambiente e JSON foram utilizados como configuração global.

## Referência

- [Instalação](#instalação)
- [Comandos Públicos](#públicos)
- [Comandos de Configuração](#configuração)

## Instalação

#### Para instalar o projeto, basta utilizar o comando de `clone` ou instalar o arquivo `.zip` manualmente

```bash
  git clone https://github.com/marquezzx/bot-ticket-free
```

#### Após a instalação (e extração) da pasta, basta abrir um terminal no diretório e instalar as dependências utilizando o comando:

```cmd
  npm install
```

#### Assim que instalar as dependências, renomeie o arquivo `.env.example` para `.env`, coloque o seu BOT_TOKEN e MONGO_URI e execute o comando

```cmd
  npm run dev
```

#Comandos

## Públicos

#### Retorna o url para adicionar o bot ao servidor

```
  /convite
```

#### Retorna o url para este repositório

```
  /source
```

## Configuração

#### Configura o sistema, salvando os dados fornecidos no banco de dados

```
  /config
```

| Parâmetros  | Descrição                                                                     |
| :---------- | :---------------------------------------------------------------------------- |
| `categoria` | **Obrigatório**. Categoria onde os canais de ticket criados serão armazenados |
| `cargo`     | **Obrigatório**. Cargo que tem acesso aos tickets                             |
| `logs`      | **Obrigatório**. Canal onde os registros de log serão enviados                |

#### Inicia o sistema, gerando a mensagem de abertura do ticket

```
  /start
```

| Parâmetro | Descrição                                                            |
| :-------- | :------------------------------------------------------------------- |
| `canal`   | **Obrigatório**. Canal que a mensagem será enviada                   |
| `cor`     | **Opcional**. Cor da mensagem (obrigatóriamente em hex #rrggbb)      |
| `imagem`  | **Opcional**. Imagem anexada à mensagem (.png / .jpg / .gif / .webp) |
