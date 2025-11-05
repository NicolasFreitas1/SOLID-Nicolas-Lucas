// PRINCÍPIO DA RESPONSABILIDADE ÚNICA (SRP)
// Cada classe tem apenas uma responsabilidade bem definida

interface Pedido {
  id: number;
  cliente: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

// Responsabilidade 1: Validação de dados
class ValidadorPedido {
  validar(pedido: Pedido): boolean {
    if (!pedido.cliente || pedido.cliente.trim() === '') {
      console.log('Erro: Nome do cliente é obrigatório');
      return false;
    }
    if (pedido.quantidade <= 0) {
      console.log('Erro: Quantidade deve ser maior que zero');
      return false;
    }
    if (pedido.precoUnitario <= 0) {
      console.log('Erro: Preço unitário deve ser maior que zero');
      return false;
    }
    return true;
  }
}

// Responsabilidade 2: Cálculo de valores
class CalculadoraPedido {
  calcularTotal(pedido: Pedido): number {
    const subtotal = pedido.quantidade * pedido.precoUnitario;
    const desconto = subtotal * 0.1; // 10% de desconto
    return subtotal - desconto;
  }

  calcularSubtotal(pedido: Pedido): number {
    return pedido.quantidade * pedido.precoUnitario;
  }
}

// Responsabilidade 3: Persistência de dados
class RepositorioPedido {
  salvar(pedido: Pedido, total: number): void {
    console.log(`Salvando pedido ${pedido.id} no banco de dados...`);
    console.log(`Cliente: ${pedido.cliente}`);
    console.log(`Produto: ${pedido.produto}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);
  }

  buscarPorId(id: number): Pedido | null {
    console.log(`Buscando pedido ${id} no banco de dados...`);
    return null;
  }
}

// Responsabilidade 4: Envio de email
class ServicoEmail {
  enviarConfirmacao(pedido: Pedido, total: number): void {
    console.log(`Enviando email de confirmação para o cliente ${pedido.cliente}...`);
    console.log(`Assunto: Confirmação de Pedido #${pedido.id}`);
    console.log(`Corpo: Seu pedido no valor de R$ ${total.toFixed(2)} foi confirmado.`);
  }

  enviarCancelamento(pedido: Pedido): void {
    console.log(`Enviando email de cancelamento para o cliente ${pedido.cliente}...`);
    console.log(`Assunto: Cancelamento de Pedido #${pedido.id}`);
  }
}

// Classe orquestradora que coordena as responsabilidades
class ProcessadorPedido {
  constructor(
    private validador: ValidadorPedido,
    private calculadora: CalculadoraPedido,
    private repositorio: RepositorioPedido,
    private servicoEmail: ServicoEmail
  ) {}

  processar(pedido: Pedido): void {
    if (!this.validador.validar(pedido)) {
      return;
    }

    const total = this.calculadora.calcularTotal(pedido);
    this.repositorio.salvar(pedido, total);
    this.servicoEmail.enviarConfirmacao(pedido, total);
  }
}

// Demonstração do uso
console.log('=== PRINCÍPIO DA RESPONSABILIDADE ÚNICA (SRP) ===\n');

const validador = new ValidadorPedido();
const calculadora = new CalculadoraPedido();
const repositorio = new RepositorioPedido();
const servicoEmail = new ServicoEmail();

const processador = new ProcessadorPedido(
  validador,
  calculadora,
  repositorio,
  servicoEmail
);

const pedido: Pedido = {
  id: 1,
  cliente: 'Maria Santos',
  produto: 'Mouse Gamer',
  quantidade: 3,
  precoUnitario: 150.00
};

processador.processar(pedido);

