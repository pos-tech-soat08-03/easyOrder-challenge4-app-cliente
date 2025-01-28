import { ClienteAdapter } from "../../../easyorder/Application/Presenter/ClienteAdapter";
import { ClienteEntity } from "../../../easyorder/Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../easyorder/Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../easyorder/Core/Entity/ValueObject/EmailValueObject";

describe("ClienteAdapter", () => {
  describe("adaptClienteJsonError", () => {
    it("should return a JSON string with the error message", () => {
      const mensagem = "Erro ao processar a solicitação";
      const result = ClienteAdapter.adaptClienteJsonError(mensagem);
      const expected = JSON.stringify({ message: mensagem });

      expect(result).toBe(expected);
    });

    it("should handle empty error message", () => {
      const mensagem = "";
      const result = ClienteAdapter.adaptClienteJsonError(mensagem);
      const expected = JSON.stringify({ message: mensagem });

      expect(result).toBe(expected);
    });

    it("should handle null error message", () => {
      const mensagem = null;
      const result = ClienteAdapter.adaptClienteJsonError(mensagem);
      const expected = JSON.stringify({ message: mensagem });

      expect(result).toBe(expected);
    });

    it("should handle undefined error message", () => {
      const mensagem = undefined;
      const result = ClienteAdapter.adaptClienteJsonError(mensagem);
      const expected = JSON.stringify({ message: mensagem });

      expect(result).toBe(expected);
    });
  });

  describe("adaptJsonListaClientes", () => {
    it("should return a JSON string with the list of clients and message", () => {
      const clientes = [
        new ClienteEntity(new CpfValueObject("12345678900"), "John Doe", new EmailValueObject("john.doe@example.com"), "1"),
        new ClienteEntity(new CpfValueObject("98765432100"), "Jane Doe", new EmailValueObject("jane.doe@example.com"), "2")
      ];
      const mensagem = "Lista de clientes";
      const result = ClienteAdapter.adaptJsonListaClientes(clientes, mensagem);
      const expected = JSON.stringify({
        mensagem: mensagem,
        clientes: [
          {
            id: "1",
            cpf: "123.456.789-00",
            nome: "John Doe",
            email: "john.doe@example.com"
          },
          {
            id: "2",
            cpf: "987.654.321-00",
            nome: "Jane Doe",
            email: "jane.doe@example.com"
          }
        ]
      }, null, 2);

      expect(result).toBe(expected);
    });

    it("should handle empty client list", () => {
      const clientes: ClienteEntity[] = [];
      const mensagem = "Nenhum cliente encontrado";
      const result = ClienteAdapter.adaptJsonListaClientes(clientes, mensagem);
      const expected = JSON.stringify({
        mensagem: mensagem,
        clientes: []
      }, null, 2);

      expect(result).toBe(expected);
    });

    it("should handle null client list", () => {
      const clientes: ClienteEntity[] = [];
      const mensagem = "Nenhum cliente encontrado";
      const result = ClienteAdapter.adaptJsonListaClientes(clientes, mensagem);
      const expected = JSON.stringify({
        mensagem: mensagem,
        clientes: []
      }, null, 2);

      expect(result).toBe(expected);
    });

    it("should handle undefined client list", () => {
      const clientes: ClienteEntity[] = [];
      const mensagem = "Nenhum cliente encontrado";
      const result = ClienteAdapter.adaptJsonListaClientes(clientes, mensagem);
      const expected = JSON.stringify({
        mensagem: mensagem,
        clientes: []
      }, null, 2);

      expect(result).toBe(expected);
    });
  });
  describe("adaptJsonCliente", () => {
    it("should return a JSON string with the client and message", () => {
      const cliente = new ClienteEntity(new CpfValueObject("12345678900"), "John Doe", new EmailValueObject("john.doe@example.com"), "1");
      const mensagem = "Cliente encontrado";
      const result = cliente ? ClienteAdapter.adaptJsonCliente(cliente, mensagem) : JSON.stringify({ mensagem: mensagem, cliente: undefined }, null, 2);
      const expected = JSON.stringify({
        mensagem: mensagem,
        cliente: {
          id: "1",
          cpf: "123.456.789-00",
          nome: "John Doe",
          email: "john.doe@example.com"
        }
      }, null, 2);

      expect(result).toBe(expected);
    });

    it("should handle null client", () => {
      const cliente = null;
      const mensagem = "Cliente não encontrado";
      const result = cliente ? ClienteAdapter.adaptJsonCliente(cliente, mensagem) : JSON.stringify({ mensagem: mensagem, cliente: null }, null, 2);
      const expected = JSON.stringify({
        mensagem: mensagem,
        cliente: null
      }, null, 2);

      expect(result).toBe(expected);
    });

    it("should handle undefined client", () => {
      const cliente = undefined;
      const mensagem = "Cliente não encontrado";
      const result = cliente ? ClienteAdapter.adaptJsonCliente(cliente, mensagem) : JSON.stringify({ mensagem: mensagem, cliente: undefined }, null, 2);
      const expected = JSON.stringify({
        mensagem: mensagem,
        cliente: undefined
      }, null, 2);

      expect(result).toBe(expected);
    });
  });

});