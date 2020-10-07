<h3 align="center">
  gobarber-api :haircut:
</h3>

<blockquote align="center">GoBarber API -> Projeto resultado do Bootcamp GoStack @Rocketseat.</blockquote>

## :smiley: Aplicação utilizada para agendamento de serviços.

- Utilizado para filtrar, listar e cadastrar prestadores de serviços, usuários e horários.

## :cold_sweat: Desafios encontrados:

- Uso de `TypeScript` e `TypeORM` para armazenamento dos dados em tabelas relacionais.
- Uso de `Raw Queries` nos bancos PostgreSQL, MongoDB e Redis.
- Uso de SOLID como arquitetura de software.

## :computer: Tecnologias utilizadas:

- ⚛️ ReactJS.
- 📱 React Native.
- ☕️ Node.js.

## :fire: Instalação:

1. Clone este repositorio.

```sh
  $ git clone https://github.com/leolivm/gobarber-api.git
```

2. `cd gobarber-api`<br />

3. `yarn install` ou `npm install` para instalar as dependências.<br />

4. Crie um arquivo `.env` na raiz do projeto e insira as informações necessárias para configurações iniciais. Utilize o arquivo `.envexample` para ver as informações necessárias.

5. Crie instâncias no Docker das seguintes imagens:

```sh
  $ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
  $ docker run --name mongodb -p 27017:27017 -d -t mongo
  $ docker run --name redis -p 6379:6379 -d -t redis:alpine
```

6. Utilize o `TypeORM` para rodar as migrations do banco de dados.

```sh
  $ yarn typeorm migration:run
```

7. `yarn dev` para rodar a aplicação em `http://localhost:3333/`.<br />

## Contato:

- [LinkedIn](https://www.linkedin.com/in/leandro-martins-0640921a4/)
- leolivm@outlook.com
