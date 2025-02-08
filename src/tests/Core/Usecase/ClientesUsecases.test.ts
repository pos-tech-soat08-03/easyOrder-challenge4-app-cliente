import { ClientesUsecases } from "../../../easyorder/Core/Usecase/ClientesUsecases";
import { ClienteGatewayInterface } from "../../../easyorder/Core/Interfaces/Gateway/ClienteGatewayInterface";
import { ClienteEntity } from "../../../easyorder/Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../easyorder/Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../easyorder/Core/Entity/ValueObject/EmailValueObject";

describe("Testes unitários ClientesUsecases", () => {
    let clienteGatewayMock: jest.Mocked<ClienteGatewayInterface>;

    beforeEach(() => {
        clienteGatewayMock = {
            listarClientes: jest.fn(),
            buscarClientePorCpf: jest.fn(),
            adicionarCliente: jest.fn(),
            atualizarCliente: jest.fn(),
        };
    });

    test("ListarClientesUsecase Deve retornar uma lista de Clientes quando disponíveis", async () => {
        const clientes = [
            new ClienteEntity(
                new CpfValueObject("12345678901"),
                "João da Silva",
                new EmailValueObject("joao@teste.com"),
                "1"
            ),
            new ClienteEntity(
                new CpfValueObject("09876543210"),
                "Maria da Silva",
                new EmailValueObject("maria@teste.com"),
                "2"
            ),
        ];
        clienteGatewayMock.listarClientes.mockResolvedValue(clientes);
        const result = await ClientesUsecases.ListarClientesUsecase(clienteGatewayMock);
        expect(result.clientes).toEqual(clientes);
        expect(result.mensagem).toBe("Sucesso. 2 Clientes encontrados.");
    });

    test("ListarClientesUsecase Deve retornar um Cliente quando disponível", async () => {
        const clientes = [
            new ClienteEntity(
                new CpfValueObject("12345678901"),
                "João da Silva",
                new EmailValueObject("joao@teste.com"),
                "1"
            ),
        ];
        clienteGatewayMock.listarClientes.mockResolvedValue(clientes);
        const result = await ClientesUsecases.ListarClientesUsecase(clienteGatewayMock);
        expect(result.clientes).toEqual(clientes);
        expect(result.mensagem).toBe("Sucesso. 1 Cliente encontrado.");
    });

    test("ListarClientesUsecase Deve lançar um erro quando clientes não forem encontrados", async () => {
        clienteGatewayMock.listarClientes.mockResolvedValue(undefined);
        await expect(ClientesUsecases.ListarClientesUsecase(clienteGatewayMock)).rejects.toThrow("Não foram encontrado clientes.");
    });

    test("BuscarClientePorCpfUsecase Deve retornar um cliente quando encontrado pelo CPF", async () => {
        const cliente = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(cliente);
        const result = await ClientesUsecases.BuscarClientePorCpfUsecase({
            clienteGateway: clienteGatewayMock,
            cpfTexto: "12345678901"
        });
        expect(result.cliente).toEqual(cliente);
        expect(result.mensagem).toBe("Cliente encontrado.");
    });
    
    test("BuscarClientePorCpfUsecase Deve lançar um erro quando cliente não for encontrado pelo CPF", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);
        await expect(ClientesUsecases.BuscarClientePorCpfUsecase({
            clienteGateway: clienteGatewayMock,
            cpfTexto: "12345678901"
        })).rejects.toThrow("Cliente não foi encontrado.");
    });

    test("AtualizarClientePorCpfUsecase Deve atualizar um cliente quando encontrado pelo CPF", async () => {
        const clienteAtual = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );
        const clienteNovo = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva Atualizado",
            new EmailValueObject("joao.atualizado@teste.com"),
            "1"
        );
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(clienteAtual);
        clienteGatewayMock.atualizarCliente.mockResolvedValue(clienteNovo);
        const result = await ClientesUsecases.AtualizarClientePorCpfUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva Atualizado",
            "joao.atualizado@teste.com"
        );
        expect(result.cliente).toEqual(clienteNovo);
        expect(result.mensagem).toBe("Cliente atualizado com sucesso.");
    });

    test("AtualizarClientePorCpfUsecase Deve lançar um erro quando cliente não for encontrado para atualização", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);
        await expect(ClientesUsecases.AtualizarClientePorCpfUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva Atualizado",
            "joao.atualizado@teste.com"
        )).rejects.toThrow ("Cliente não foi encontrado para atualização.");
    });

    test("AtualizarClientePorCpfUsecase Deve lançar um erro quando atualização não for realizada", async () => {
        const clienteAtual = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(clienteAtual);
        clienteGatewayMock.atualizarCliente.mockResolvedValue(undefined);
        await expect(ClientesUsecases.AtualizarClientePorCpfUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva Atualizado",
            "joao.atualizado@teste.com"
        )).rejects.toThrow ("Atualização não foi realizada.");
    });

    test("CadastrarClienteUsecase Deve lançar um erro quando cliente já estiver cadastrado com o mesmo CPF", async () => {
        const clienteExistente = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(clienteExistente);
        await expect(ClientesUsecases.CadastrarClienteUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva",
            "joao@teste.com"
        )).rejects.toThrow("Cliente já cadastrado com esse CPF.");
    });

    test("CadastrarClienteUsecase Deve cadastrar um novo cliente quando CPF não estiver cadastrado", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);
        const clienteNovo = new ClienteEntity(
            new CpfValueObject("11111111111"),
            "João da Silva Novo",
            new EmailValueObject("joao.novo@teste.com")
        );
        clienteGatewayMock.adicionarCliente.mockResolvedValue(clienteNovo);
        const result = await ClientesUsecases.CadastrarClienteUsecase(
            clienteGatewayMock,
            "22222222222",
            "João da Silva",
            "joao@teste.com"
        );
        expect(result.mensagem).toBe("Cliente cadastrado com sucesso.");
    });

    test("CadastrarClienteUsecase Deve lançar um erro quando o cadastro não for realizado", async () => {
        clienteGatewayMock.adicionarCliente.mockResolvedValue(undefined);
        await expect(ClientesUsecases.CadastrarClienteUsecase(
            clienteGatewayMock,
            "22222222222",
            "João da Silva",
            "joao@teste.com"
        )).rejects.toThrow ("Cadastro não foi realizado.");
    });

});
