import { ClientesUsecases } from "../../../easyorder/Core/Usecase/ClientesUsecases";
import { ClienteGatewayInterface } from "../../../easyorder/Core/Interfaces/Gateway/ClienteGatewayInterface";
import { ClienteEntity } from "../../../easyorder/Core/Entity/ClienteEntity";
import { CpfValueObject } from "../../../easyorder/Core/Entity/ValueObject/CpfValueObject";
import { EmailValueObject } from "../../../easyorder/Core/Entity/ValueObject/EmailValueObject";

describe("Casos de Uso de Cliente", () => {
    let clienteGatewayMock: jest.Mocked<ClienteGatewayInterface>;

    beforeEach(() => {
        clienteGatewayMock = {
            listarClientes: jest.fn(),
            buscarClientePorCpf: jest.fn(),
            adicionarCliente: jest.fn(),
            atualizarCliente: jest.fn(),
        };
    });

    test("Deve retornar uma lista de Clientes quando encontrados", async () => {
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
        expect(result.mensagem).toBe("Sucesso. 2 Cliente(s) encontrado(s).");
    });

    test("Deve retornar uma mensagem quando clientes não forem encontrados", async () => {
        clienteGatewayMock.listarClientes.mockResolvedValue(undefined);

        const result = await ClientesUsecases.ListarClientesUsecase(clienteGatewayMock);

        expect(result.clientes).toBeUndefined();
        expect(result.mensagem).toBe("Não foram encontrado clientes.");
    });

    test("Deve retornar um cliente quando encontrado pelo CPF", async () => {
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
    
    test("Deve retornar uma mensagem quando cliente não for encontrado pelo CPF", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);
    
        const result = await ClientesUsecases.BuscarClientePorCpfUsecase({
            clienteGateway: clienteGatewayMock,
            cpfTexto: "12345678901"
        });
    
        expect(result.cliente).toBeUndefined();
        expect(result.mensagem).toBe("Cliente não foi encontrado.");
    });

    test("Deve atualizar um cliente quando encontrado pelo CPF", async () => {
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

    test("Deve retornar uma mensagem quando cliente não for encontrado para atualização", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);

        const result = await ClientesUsecases.AtualizarClientePorCpfUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva Atualizado",
            "joao.atualizado@teste.com"
        );

        expect(result.cliente).toBeUndefined();
        expect(result.mensagem).toBe("Cliente não foi encontrado para atualização.");
    });

    test("Deve retornar uma mensagem de erro quando atualização não for realizada", async () => {
        const clienteAtual = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );

        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(clienteAtual);
        clienteGatewayMock.atualizarCliente.mockResolvedValue(undefined);

        const result = await ClientesUsecases.AtualizarClientePorCpfUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva Atualizado",
            "joao.atualizado@teste.com"
        );

        expect(result.cliente).toBeUndefined();
        expect(result.mensagem).toBe("Erro: Atualização não foi realizada.");
    });

    test("Deve retornar uma mensagem quando cliente já estiver cadastrado com o mesmo CPF", async () => {
        const clienteExistente = new ClienteEntity(
            new CpfValueObject("12345678901"),
            "João da Silva",
            new EmailValueObject("joao@teste.com"),
            "1"
        );

        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(clienteExistente);

        const result = await ClientesUsecases.CadastrarClienteUsecase(
            clienteGatewayMock,
            "12345678901",
            "João da Silva",
            "joao@teste.com"
        );

        expect(result.cliente).toBeUndefined();
        expect(result.mensagem).toBe("Cliente já cadastrado com esse CPF.");
    });

    test("Deve cadastrar um novo cliente quando CPF não estiver cadastrado", async () => {
        clienteGatewayMock.buscarClientePorCpf.mockResolvedValue(undefined);

        let cpfAleatorio = "";
        const tamanho = 11;
        const caracteres = "0123456789";
    
        for (let i = 0; i < tamanho; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          cpfAleatorio += caracteres[indiceAleatorio];
        }

        const clienteNovo = new ClienteEntity(
            new CpfValueObject(cpfAleatorio),
            "João da Silva",
            new EmailValueObject("joao@teste.com")
        );

        clienteGatewayMock.adicionarCliente.mockResolvedValue(clienteNovo);

        const result = await ClientesUsecases.CadastrarClienteUsecase(
            clienteGatewayMock,
            cpfAleatorio,
            "João da Silva",
            "joao@teste.com"
        );

        expect(result.mensagem).toBe("Cliente cadastrado com sucesso.");
    });


});
