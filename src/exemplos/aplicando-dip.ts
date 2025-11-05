// PRINCÍPIO DA INVERSÃO DE DEPENDÊNCIAS (DIP)
// Módulos de alto nível não devem depender de módulos de baixo nível.
// Ambos devem depender de abstrações.

// ============================================
// ABSTRAÇÕES (INTERFACES) - Nível de alto nível
// ============================================

interface RepositorioUsuario {
  buscarPorId(id: number): Usuario | null;
  salvar(usuario: Usuario): void;
}

interface ServicoNotificacao {
  enviar(usuario: Usuario, mensagem: string): void;
}

interface Logger {
  log(mensagem: string): void;
  erro(mensagem: string): void;
}

// ============================================
// ENTIDADES
// ============================================

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// ============================================
// IMPLEMENTAÇÕES CONCRETAS - Nível de baixo nível
// ============================================

// Implementação 1: Repositório MySQL
class RepositorioMySQL implements RepositorioUsuario {
  buscarPorId(id: number): Usuario | null {
    console.log(`[MySQL] Buscando usuário ${id} no banco MySQL...`);
    // Simulação de busca
    return { id, nome: 'João Silva', email: 'joao@example.com' };
  }

  salvar(usuario: Usuario): void {
    console.log(`[MySQL] Salvando usuário ${usuario.id} no MySQL...`);
    console.log(`  Nome: ${usuario.nome}`);
    console.log(`  Email: ${usuario.email}`);
  }
}

// Implementação 2: Repositório PostgreSQL
class RepositorioPostgreSQL implements RepositorioUsuario {
  buscarPorId(id: number): Usuario | null {
    console.log(`[PostgreSQL] Buscando usuário ${id} no banco PostgreSQL...`);
    // Simulação de busca
    return { id, nome: 'Maria Santos', email: 'maria@example.com' };
  }

  salvar(usuario: Usuario): void {
    console.log(`[PostgreSQL] Salvando usuário ${usuario.id} no PostgreSQL...`);
    console.log(`  Nome: ${usuario.nome}`);
    console.log(`  Email: ${usuario.email}`);
  }
}

// Implementação 3: Serviço de Email
class EmailNotificacao implements ServicoNotificacao {
  enviar(usuario: Usuario, mensagem: string): void {
    console.log(`[Email] Enviando email para ${usuario.email}...`);
    console.log(`  Assunto: Notificação`);
    console.log(`  Mensagem: ${mensagem}`);
  }
}

// Implementação 4: Serviço de SMS
class SMSNotificacao implements ServicoNotificacao {
  enviar(usuario: Usuario, mensagem: string): void {
    console.log(`[SMS] Enviando SMS para usuário ${usuario.nome}...`);
    console.log(`  Mensagem: ${mensagem}`);
  }
}

// Implementação 5: Logger no Console
class LoggerConsole implements Logger {
  log(mensagem: string): void {
    console.log(`[LOG] ${mensagem}`);
  }

  erro(mensagem: string): void {
    console.error(`[ERRO] ${mensagem}`);
  }
}

// Implementação 6: Logger em Arquivo (simulado)
class LoggerArquivo implements Logger {
  log(mensagem: string): void {
    console.log(`[ARQUIVO] Registrando log: ${mensagem}`);
  }

  erro(mensagem: string): void {
    console.error(`[ARQUIVO] Registrando erro: ${mensagem}`);
  }
}

// ============================================
// CLASSE DE ALTO NÍVEL - Depende de abstrações
// ============================================

class ServicoUsuario {
  constructor(
    private repositorio: RepositorioUsuario,
    private notificacao: ServicoNotificacao,
    private logger: Logger
  ) {}

  criarUsuario(id: number, nome: string, email: string): void {
    this.logger.log(`Criando usuário ${id}`);

    const usuario: Usuario = { id, nome, email };

    try {
      this.repositorio.salvar(usuario);
      this.notificacao.enviar(usuario, `Bem-vindo, ${nome}! Sua conta foi criada com sucesso.`);
      this.logger.log(`Usuário ${id} criado com sucesso`);
    } catch (error) {
      this.logger.erro(`Erro ao criar usuário ${id}`);
    }
  }

  buscarUsuario(id: number): Usuario | null {
    this.logger.log(`Buscando usuário ${id}`);
    return this.repositorio.buscarPorId(id);
  }
}

// ============================================
// DEMONSTRAÇÃO DO USO
// ============================================

console.log('=== PRINCÍPIO DA INVERSÃO DE DEPENDÊNCIAS (DIP) ===\n');

// Exemplo 1: Usando MySQL + Email + Logger Console
console.log('--- Exemplo 1: MySQL + Email + Logger Console ---');
const repositorioMySQL = new RepositorioMySQL();
const emailNotificacao = new EmailNotificacao();
const loggerConsole = new LoggerConsole();

const servicoUsuario1 = new ServicoUsuario(
  repositorioMySQL,
  emailNotificacao,
  loggerConsole
);

servicoUsuario1.criarUsuario(1, 'João Silva', 'joao@example.com');

// Exemplo 2: Usando PostgreSQL + SMS + Logger Arquivo
console.log('\n--- Exemplo 2: PostgreSQL + SMS + Logger Arquivo ---');
const repositorioPostgreSQL = new RepositorioPostgreSQL();
const smsNotificacao = new SMSNotificacao();
const loggerArquivo = new LoggerArquivo();

const servicoUsuario2 = new ServicoUsuario(
  repositorioPostgreSQL,
  smsNotificacao,
  loggerArquivo
);

servicoUsuario2.criarUsuario(2, 'Maria Santos', 'maria@example.com');

// Exemplo 3: Buscando usuário
console.log('\n--- Exemplo 3: Buscando usuário ---');
const usuario = servicoUsuario1.buscarUsuario(1);
if (usuario) {
  console.log(`Usuário encontrado: ${usuario.nome} (${usuario.email})`);
}

console.log('\n=== BENEFÍCIOS DO DIP ===');
console.log('✓ ServicoUsuario não depende de implementações concretas');
console.log('✓ Fácil trocar MySQL por PostgreSQL sem modificar ServicoUsuario');
console.log('✓ Fácil trocar Email por SMS sem modificar ServicoUsuario');
console.log('✓ Fácil adicionar novos tipos de repositório ou notificação');
console.log('✓ Código mais testável (pode usar mocks/fakes facilmente)');
console.log('✓ Desacoplamento entre módulos de alto e baixo nível');

