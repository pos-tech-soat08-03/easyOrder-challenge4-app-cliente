import { ClientesController } from "../../../easyorder/Application/Controller/ClientesController";
import { IDbConnection } from "../../../easyorder/Core/Interfaces/IDbConnection";
import { ClientesUsecases } from "../../../easyorder/Core/Usecase/ClientesUsecases";
import { ClienteAdapter } from "../../../easyorder/Application/Presenter/ClienteAdapter";
import { ClienteGatewayMock } from "../../../easyorder/Infrastructure/DB/Mock/ClienteGatewayMock";

jest.mock("../../../easyorder/Core/Usecase/ClientesUsecases");
jest.mock("../../../easyorder/Application/Presenter/ClienteAdapter");

describe("ClientesController", () => {
    let dbConnection: IDbConnection;

    beforeEach(() => {
        dbConnection = {
            gateways: {
                clienteGateway: new ClienteGatewayMock(),
            },
        } as unknown as IDbConnection;
    });

    test("ListarClientes - should return adapted JSON list of clients", async () => {
        const clientes = [{ id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" }];
        const mensagem = "Clientes listados com sucesso";
        (ClientesUsecases.ListarClientesUsecase as jest.Mock).mockResolvedValue({ clientes, mensagem });
        (ClienteAdapter.adaptJsonListaClientes as jest.Mock).mockReturnValue("adapted JSON list");

        const result = await ClientesController.ListarClientes(dbConnection);

        expect(ClientesUsecases.ListarClientesUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway);
        expect(ClienteAdapter.adaptJsonListaClientes).toHaveBeenCalledWith(clientes, mensagem);
        expect(result).toBe("adapted JSON list");
    });

    test("BuscarClientePorCpf - should return adapted JSON client", async () => {
        const cliente = { id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente encontrado com sucesso";
        (ClientesUsecases.BuscarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("adapted JSON client");

        const result = await ClientesController.BuscarClientePorCpf(dbConnection, "12345678901");

        expect(ClientesUsecases.BuscarClientePorCpfUsecase).toHaveBeenCalledWith({ clienteGateway: dbConnection.gateways.clienteGateway, cpfTexto: "12345678901" });
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("adapted JSON client");
    });

    test("AtualizarClientePorCpf - should return adapted JSON updated client", async () => {
        const cliente = { id: "1", nome: "João Atualizado", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente atualizado com sucesso";
        (ClientesUsecases.AtualizarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("adapted JSON updated client");

        const result = await ClientesController.AtualizarClientePorCpf(dbConnection, "12345678901", "João Atualizado", "joao@teste.com");

        expect(ClientesUsecases.AtualizarClientePorCpfUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João Atualizado", "joao@teste.com");
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("adapted JSON updated client");
    });

    test("CadastrarCliente - should return adapted JSON new client", async () => {
        const cliente = { id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente cadastrado com sucesso";
        (ClientesUsecases.CadastrarClienteUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("adapted JSON new client");

        const result = await ClientesController.CadastrarCliente(dbConnection, "12345678901", "João", "joao@teste.com");

        expect(ClientesUsecases.CadastrarClienteUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João", "joao@teste.com");
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("adapted JSON new client");
    });

    test("ListarClientes - should return error message when no clients are found", async () => {
        const mensagem = "Nenhum cliente encontrado";
        (ClientesUsecases.ListarClientesUsecase as jest.Mock).mockResolvedValue({ clientes: [], mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");
    
        const result = await ClientesController.ListarClientes(dbConnection);
    
        expect(ClientesUsecases.ListarClientesUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway);
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });
    
    test("BuscarClientePorCpf - should return error message when client is not found", async () => {
        const mensagem = "Cliente não encontrado";
        (ClientesUsecases.BuscarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");

        const result = await ClientesController.BuscarClientePorCpf(dbConnection, "12345678901");

        expect(ClientesUsecases.BuscarClientePorCpfUsecase).toHaveBeenCalledWith({ clienteGateway: dbConnection.gateways.clienteGateway, cpfTexto: "12345678901" });
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });
    
    test("AtualizarClientePorCpf - should return error message when client is not found", async () => {
        const mensagem = "Cliente não encontrado";
        (ClientesUsecases.AtualizarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");

        const result = await ClientesController.AtualizarClientePorCpf(dbConnection, "12345678901", "João Atualizado", "joao@teste.com");

        expect(ClientesUsecases.AtualizarClientePorCpfUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João Atualizado", "joao@teste.com");
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });

    test("CadastrarCliente - should return error message when client is not created", async () => {
        const mensagem = "Erro ao cadastrar cliente";
        (ClientesUsecases.CadastrarClienteUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");
    
        const result = await ClientesController.CadastrarCliente(dbConnection, "12345678901", "João", "joao@teste.com");
    
        expect(ClientesUsecases.CadastrarClienteUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João", "joao@teste.com");
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });

});

