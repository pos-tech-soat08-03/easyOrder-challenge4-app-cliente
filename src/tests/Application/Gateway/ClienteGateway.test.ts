import { Sequelize } from "sequelize";
import { ClienteGateway } from "../../../easyorder/Application/Gateway/ClienteGateway";
import { ClienteEntity } from "../../../easyorder/Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../easyorder/Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../easyorder/Core/Entity/ValueObject/EmailValueObject";
import { ConnectionInfo } from "../../../easyorder/Core/Types/ConnectionInfo";

jest.mock("sequelize");

describe("ClienteGateway", () => {
  let clienteGateway: ClienteGateway;
  let mockSequelize: jest.Mocked<Sequelize>;

  const mockConnectionInfo: ConnectionInfo = {
    database: "testdb",
    username: "testuser",
    password: "testpass",
    hostname: "localhost",
    portnumb: 5432,
    databaseType: "mysql",
  };

  beforeEach(() => {
    mockSequelize = new Sequelize() as jest.Mocked<Sequelize>;
    mockSequelize.define = jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findOne: jest.fn(),
      upsert: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    });
    Object.defineProperty(mockSequelize, 'models', {
      value: {
        Cliente: mockSequelize.define('Cliente', {})
      }
    });
    clienteGateway = new ClienteGateway(mockConnectionInfo, mockSequelize);
  });

  test("buscarClientePorCpf deve retornar undefined para CPF não existente", async () => {
    mockSequelize.models.Cliente.findOne = jest.fn().mockResolvedValue(null);

    const cliente = await clienteGateway.buscarClientePorCpf(new CpfValueObject("00000000000"));
    expect(cliente).toBeUndefined();
  });

  test("adicionarCliente deve adicionar um novo cliente", async () => {
    const novoCliente = new ClienteEntity(
      new CpfValueObject("12345678901"),
      "Novo Cliente",
      new EmailValueObject("novo.cliente@teste.com")
    );
    mockSequelize.models.Cliente.upsert = jest.fn().mockResolvedValue([novoCliente, true]);

    const clienteAdicionado = await clienteGateway.adicionarCliente(novoCliente);
    expect(clienteAdicionado).toBeDefined();
  });

  test("removerCliente deve remover um cliente existente", async () => {
    const cliente = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "Cliente 1",
      new EmailValueObject("cliente1@teste.com")
    );
    mockSequelize.models.Cliente.destroy = jest.fn().mockResolvedValue(1);

    const result = await clienteGateway.removerCliente(cliente);
    expect(result).toBe(true);
  });

  test("atualizarCliente deve atualizar cliente existente", async () => {
    const cliente = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "Cliente 1",
      new EmailValueObject("cliente1@teste.com")
    );
    const novoCliente = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "Cliente Atualizado",
      new EmailValueObject("cliente.atualizado@teste.com")
    );
    mockSequelize.models.Cliente.update = jest.fn().mockResolvedValue([1]);

    const clienteAtualizado = await clienteGateway.atualizarCliente(cliente, novoCliente);
    expect(clienteAtualizado).toBeDefined();
    expect(clienteAtualizado?.getNome()).toBe("Cliente 1");
  });
});