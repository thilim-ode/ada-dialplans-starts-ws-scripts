# ADA Dialplans, Starts, Ws e Scripts

## Objetivo

Este repositório deve manter os arquivos de dialplan organizados por cliente e por ADA. Todos os contribuintes devem seguir o fluxo abaixo para evitar alterações conflitantes e garantir que o trabalho seja feito sobre a versão mais atualizada do projeto.

## Organização das pastas

A estrutura deve seguir este padrão:

```text
/
├── README.md
├── <cliente-1>/
│   ├── <arquivos da ADA, quando houver apenas uma ADA>
│   └── <ADA-2>/
│       └── <arquivos da ADA-2>
└── <cliente-2>/
    ├── <ADA-1>/
    │   └── <arquivos da ADA-1>
    └── <ADA-2>/
        └── <arquivos da ADA-2>
```

Regras:

- Cada cliente deve ter sua própria subpasta na raiz do repositório.
- Use um nome consistente para a pasta do cliente, preferencialmente sem espaços e sem caracteres especiais.
- Se o cliente tiver apenas uma ADA, os arquivos podem ficar diretamente na pasta do cliente, caso esse seja o padrão adotado pelo projeto.
- Se o cliente tiver mais de uma ADA, crie uma subpasta para cada ADA dentro da pasta do cliente.
- Nunca misture arquivos de clientes ou de ADAs diferentes na mesma pasta.
- Antes de criar uma nova pasta, verifique se o cliente ou a ADA já existem para evitar duplicidades.

Exemplo:

```text
cliente-acme/
├── ada-001/
│   ├── entrada.conf
│   └── saida.conf
└── ada-002/
    ├── entrada.conf
    └── saida.conf
```

## Pré-requisitos

Instale o Git e confirme que ele está disponível no terminal:

```bash
git --version
```

Também é necessário ter acesso ao repositório remoto e configurar sua identidade Git, caso ainda não tenha feito isso:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## Primeiro acesso: clonar o repositório

Faça o clone apenas uma vez, no computador em que irá trabalhar:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA>
```

Confira se o repositório remoto está configurado corretamente:

```bash
git remote -v
git status
```

A partir desse momento, entre na pasta local do repositório sempre que for trabalhar.

## Antes de começar qualquer trabalho

Sempre atualize sua cópia local antes de criar ou alterar arquivos. Mesmo que você tenha trabalhado no repositório anteriormente, execute estes passos antes de começar uma nova tarefa:

1. Verifique se existem alterações locais:

   ```bash
   git status
   ```

2. Se você estiver em outra branch, finalize ou guarde o trabalho atual antes de continuar. Não troque de branch com alterações não relacionadas sem entender o impacto.

3. Mude para a branch `main` e obtenha a versão mais recente:

   ```bash
   git switch main
   git pull origin main
   ```

   Em versões antigas do Git, o equivalente ao primeiro comando é:

   ```bash
   git checkout main
   ```

4. Crie uma branch própria para a tarefa, sempre a partir da `main` atualizada:

   ```bash
   git switch -c tipo/descricao-curta
   ```

   Exemplos de nomes:

   ```text
   feature/cliente-acme-ada-001
   fix/ajuste-timeout-acme
   docs/atualiza-readme
   ```

Não faça alterações diretamente na `main`. A `main` deve permanecer estável e atualizada.

## Durante o trabalho

1. Trabalhe somente nos arquivos da tarefa e na pasta correta do cliente/ADA.
2. Preserve os nomes e a estrutura existentes, salvo quando a mudança exigir uma reorganização.
3. Verifique os arquivos alterados frequentemente:

   ```bash
   git status
   git diff
   ```

4. Faça os testes ou validações necessários para confirmar que a alteração funciona.
5. Não inclua arquivos temporários, credenciais, senhas, chaves, logs ou arquivos gerados automaticamente.
6. Se perceber que outra pessoa alterou a mesma área, pare e alinhe a mudança antes de sobrescrever trabalho existente.

## Preparar e revisar as alterações

Antes de criar o commit, confira exatamente o que será enviado:

```bash
git status
git diff
```

Adicione apenas os arquivos relacionados à tarefa. Evite usar `git add .` sem revisar o resultado; quando possível, informe os caminhos explicitamente:

```bash
git add <caminho-do-arquivo>
```

Depois, revise o que foi colocado na área de stage:

```bash
git diff --staged
```

Se tudo estiver correto, crie um commit com uma mensagem clara e objetiva:

```bash
git commit -m "Descreve a alteração realizada"
```

A mensagem deve explicar o resultado da alteração, por exemplo:

```bash
git commit -m "Adiciona dialplan da ADA 001 do cliente Acme"
```

## Atualizar a branch antes do push

Antes de enviar seu commit, confirme se a `main` recebeu novas alterações desde que sua branch foi criada. Atualize as referências remotas:

```bash
git fetch origin
git log --oneline HEAD..origin/main
```

Se houver novos commits na `main`, traga-os para sua branch. O fluxo recomendado é:

```bash
git switch main
git pull origin main
git switch <sua-branch>
git rebase main
```

Se surgirem conflitos:

1. Abra os arquivos indicados pelo Git e resolva os conflitos manualmente.
2. Remova os marcadores `<<<<<<<`, `=======` e `>>>>>>>`.
3. Valide os arquivos alterados.
4. Marque os conflitos como resolvidos:

   ```bash
   git add <arquivo-resolvido>
   git rebase --continue
   ```

5. Se precisar cancelar o rebase, use:

   ```bash
   git rebase --abort
   ```

Não prossiga com o push enquanto houver conflitos ou dúvidas sobre a resolução.

## Enviar a branch para o remoto

No primeiro push da branch, use:

```bash
git push -u origin <sua-branch>
```

Nos próximos pushes da mesma branch, use:

```bash
git push
```

Depois do push, abra um Pull Request/Merge Request da sua branch para `main`, conforme o serviço utilizado pelo projeto. Informe o que foi alterado, quais clientes/ADAs foram afetados e quais validações foram realizadas.

## Fluxo resumido

Para uma nova tarefa:

```bash
cd <pasta-do-repositorio>
git status
git switch main
git pull origin main
git switch -c tipo/descricao-curta

# Realize as alterações e valide o trabalho.
git status
git diff
git add <arquivos-da-tarefa>
git diff --staged
git commit -m "Descreve a alteração realizada"
git fetch origin
git switch main
git pull origin main
git switch <sua-branch>
git rebase main
git push -u origin <sua-branch>
```

## Checklist antes de finalizar

- [ ] O trabalho foi feito em uma branch própria.
- [ ] A branch foi criada a partir da `main` atualizada com `git pull origin main`.
- [ ] Os arquivos estão na pasta correta do cliente e da ADA.
- [ ] Não foram incluídos arquivos temporários, credenciais ou alterações não relacionadas.
- [ ] O `git diff` foi revisado antes do commit.
- [ ] As validações necessárias foram executadas.
- [ ] A mensagem do commit é clara.
- [ ] A branch foi atualizada com a `main` antes do push.
- [ ] O push foi concluído e o Pull Request/Merge Request foi aberto.
