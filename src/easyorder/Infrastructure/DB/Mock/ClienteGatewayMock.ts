import { ClienteEntity } from "../../../Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../Core/Entity/ValueObject/EmailValueObject";
import { ClienteGatewayInterface } from "../../../Core/Interfaces/Gateway/ClienteGatewayInterface";

export class ClienteGatewayMock implements ClienteGatewayInterface {
  private clientes: ClienteEntity[];

  constructor() {
    // dados mockados
    this.clientes = [
      new ClienteEntity(
        new CpfValueObject("41452032408"),
        "João de Oliveira",
        new EmailValueObject("joao.oliveira@uol.com.br")
      ),
      new ClienteEntity(
        new CpfValueObject("04462220030"),
        "Maria Aparecida de Castro e Silva",
        new EmailValueObject("maria.cida+easyorder2231@gmail.com")
      ),
      new ClienteEntity(
        new CpfValueObject("59257663345"),
        "Cláudia Regina Esposito",
        new EmailValueObject("clau456@hotmail.com")
      ),
    ];
  }

  public async listarClientes(): Promise<ClienteEntity[]> {
    return this.clientes;
  }

  public async buscarClientePorCpf(
    cpf: CpfValueObject
  ): Promise<ClienteEntity | undefined> {
    for (let cliente of this.clientes) {
      if (cliente.getCpf().getValue() === cpf.getValue()) return cliente;
    }
    return undefined;
  }

  public async adicionarCliente(cliente: ClienteEntity): Promise<ClienteEntity | undefined> {
    if (await this.buscarClientePorCpf(cliente.getCpf()) !== undefined) {
      return undefined;
    }
    this.clientes.push(cliente);
    return cliente;
  }

  public async atualizarCliente(
    cliente: ClienteEntity,
    novoCliente: ClienteEntity
  ): Promise<ClienteEntity | undefined> {
    if (this.buscarClientePorCpf(cliente.getCpf()) == undefined) {
      return undefined;
    }
    const indice = this.clientes.findIndex((cliente_unit) => {
      cliente_unit.getCpf() !== cliente.getCpf();
    });
    this.clientes[indice] = novoCliente;
    return novoCliente;
  }
}
