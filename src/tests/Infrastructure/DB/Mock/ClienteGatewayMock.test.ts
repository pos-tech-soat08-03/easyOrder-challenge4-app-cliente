import { ClienteGatewayMock } from "../../../../easyorder/Infrastructure/DB/Mock/ClienteGatewayMock";
import { ClienteEntity } from "../../../../easyorder/Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../../easyorder/Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../../easyorder/Core/Entity/ValueObject/EmailValueObject";

describe("ClienteGatewayMock", () => {
  let clienteGatewayMock: ClienteGatewayMock;

  beforeEach(() => {
    clienteGatewayMock = new ClienteGatewayMock();
  });

  test("listarClientes deve retornar todos os clientes", async () => {
    const clientes = await clienteGatewayMock.listarClientes();
    expect(clientes.length).toBe(3);
    expect(clientes[0].getCpf().getValue()).toBe("41452032408");
    expect(clientes[1].getCpf().getValue()).toBe("04462220030");
    expect(clientes[2].getCpf().getValue()).toBe("59257663345");
  });

  test("buscarClientePorCpf deve retornar o cliente correto", async () => {
    const cliente = await clienteGatewayMock.buscarClientePorCpf(new CpfValueObject("41452032408"));
    expect(cliente).toBeDefined();
    expect(cliente?.getCpf().getValue()).toBe("41452032408");
  });

  test("buscarClientePorCpf deve retornar undefined para CPF não existente", async () => {
    const cliente = await clienteGatewayMock.buscarClientePorCpf(new CpfValueObject("00000000000"));
    expect(cliente).toBeUndefined();
  });

  test("adicionarCliente deve adicionar um novo cliente", async () => {
    const novoCliente = new ClienteEntity(
      new CpfValueObject("12345678901"),
      "Novo Cliente",
      new EmailValueObject("novo.cliente@teste.com")
    );
    const clienteAdicionado = await clienteGatewayMock.adicionarCliente(novoCliente);
    expect(clienteAdicionado).toBeDefined();
    const clientes = await clienteGatewayMock.listarClientes();
    expect(clientes.length).toBe(4);
  });

  test("adicionarCliente não deve adicionar cliente com CPF duplicado", async () => {
    const clienteDuplicado = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "Cliente Duplicado",
      new EmailValueObject("cliente.duplicado@teste.com")
    );
    const clienteAdicionado = await clienteGatewayMock.adicionarCliente(clienteDuplicado);
    expect(clienteAdicionado).toBeUndefined();
    const clientes = await clienteGatewayMock.listarClientes();
    expect(clientes.length).toBe(3);
  });

  test("atualizarCliente deve atualizar cliente existente", async () => {
    const cliente = await clienteGatewayMock.buscarClientePorCpf(new CpfValueObject("41452032408"));
    const novoCliente = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "João Atualizado",
      new EmailValueObject("joao.atualizado@teste.com")
    );
    const clienteAtualizado = await clienteGatewayMock.atualizarCliente(cliente!, novoCliente);
    expect(clienteAtualizado).toBeDefined();
    expect(clienteAtualizado?.getNome()).toBe("João Atualizado");
  });

  test("atualizarCliente deve manter o mesmo CPF", async () => {
    const cliente = await clienteGatewayMock.buscarClientePorCpf(new CpfValueObject("41452032408"));
    const novoCliente = new ClienteEntity(
      new CpfValueObject("41452032408"),
      "João Atualizado",
      new EmailValueObject("joao.atualizado@teste.com")
    );
    const clienteAtualizado = await clienteGatewayMock.atualizarCliente(cliente!, novoCliente);
    expect(clienteAtualizado).toBeDefined();
    expect(clienteAtualizado?.getCpf().getValue()).toBe("41452032408");
  });

  test("atualizarCliente deve atualizar o nome e email do cliente", async () => {
    const cliente = await clienteGatewayMock.buscarClientePorCpf(new CpfValueObject("04462220030"));
    const novoCliente = new ClienteEntity(
      new CpfValueObject("04462220030"),
      "Maria Atualizada",
      new EmailValueObject("maria.atualizada@teste.com")
    );
    const clienteAtualizado = await clienteGatewayMock.atualizarCliente(cliente!, novoCliente);
    expect(clienteAtualizado).toBeDefined();
    expect(clienteAtualizado?.getNome()).toBe("Maria Atualizada");
    expect(clienteAtualizado?.getEmail().getValue()).toBe("maria.atualizada@teste.com");
  });

});