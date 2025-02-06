import { ClientesController } from "../../../easyorder/Application/Controller/ClientesController";
import { IDbConnection } from "../../../easyorder/Core/Interfaces/IDbConnection";
import { ClientesUsecases } from "../../../easyorder/Core/Usecase/ClientesUsecases";
import { ClienteAdapter } from "../../../easyorder/Application/Presenter/ClienteAdapter";
import { ClienteGatewayMock } from "../../../easyorder/Infrastructure/DB/Mock/ClienteGatewayMock";

jest.mock("../../../easyorder/Core/Usecase/ClientesUsecases");
jest.mock("../../../easyorder/Application/Presenter/ClienteAdapter");

describe("Testes unitários ClientesController", () => {
    let dbConnection: IDbConnection;

    beforeEach(() => {
        dbConnection = {
            gateways: {
                clienteGateway: new ClienteGatewayMock(),
            },
        } as unknown as IDbConnection;
    });

    test("ListarClientes Deve retornar lista JSON de clientes formatada", async () => {
        const clientes = [{ id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" }];
        const mensagem = "Clientes listados com sucesso";
        (ClientesUsecases.ListarClientesUsecase as jest.Mock).mockResolvedValue({ clientes, mensagem });
        (ClienteAdapter.adaptJsonListaClientes as jest.Mock).mockReturnValue("lista JSON formatada");

        const result = await ClientesController.ListarClientes(dbConnection);

        expect(ClientesUsecases.ListarClientesUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway);
        expect(ClienteAdapter.adaptJsonListaClientes).toHaveBeenCalledWith(clientes, mensagem);
        expect(result).toBe("lista JSON formatada");
    });

    test("BuscarClientePorCpf Deve retornar JSON de cliente formatado", async () => {
        const cliente = { id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente encontrado com sucesso";
        (ClientesUsecases.BuscarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("JSON cliente formatado");

        const result = await ClientesController.BuscarClientePorCpf(dbConnection, "12345678901");

        expect(ClientesUsecases.BuscarClientePorCpfUsecase).toHaveBeenCalledWith({ clienteGateway: dbConnection.gateways.clienteGateway, cpfTexto: "12345678901" });
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("JSON cliente formatado");
    });

    test("AtualizarClientePorCpf Deve retornar JSON de cliente atualizado formatado", async () => {
        const cliente = { id: "1", nome: "João Atualizado", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente atualizado com sucesso";
        (ClientesUsecases.AtualizarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("JSON cliente formatado");

        const result = await ClientesController.AtualizarClientePorCpf(dbConnection, "12345678901", "João Atualizado", "joao@teste.com");

        expect(ClientesUsecases.AtualizarClientePorCpfUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João Atualizado", "joao@teste.com");
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("JSON cliente formatado");
    });

    test("CadastrarCliente Deve retornar JSON de cliente cadastrado formatado", async () => {
        const cliente = { id: "1", nome: "João", cpf: "12345678901", email: "joao@teste.com" };
        const mensagem = "Cliente cadastrado com sucesso";
        (ClientesUsecases.CadastrarClienteUsecase as jest.Mock).mockResolvedValue({ cliente, mensagem });
        (ClienteAdapter.adaptJsonCliente as jest.Mock).mockReturnValue("JSON cliente formatado");

        const result = await ClientesController.CadastrarCliente(dbConnection, "12345678901", "João", "joao@teste.com");

        expect(ClientesUsecases.CadastrarClienteUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João", "joao@teste.com");
        expect(ClienteAdapter.adaptJsonCliente).toHaveBeenCalledWith(cliente, mensagem);
        expect(result).toBe("JSON cliente formatado");
    });

    test("ListarClientes Deve retornar msg de erro quando cliente não foi listado", async () => {
        const mensagem = "Nenhum cliente encontrado";
        (ClientesUsecases.ListarClientesUsecase as jest.Mock).mockResolvedValue({ clientes: [], mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");
    
        const result = await ClientesController.ListarClientes(dbConnection);
    
        expect(ClientesUsecases.ListarClientesUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway);
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });
    
    test("BuscarClientePorCpf Deve retornar msg de erro quando cliente não foi encontrado", async () => {
        const mensagem = "Cliente não encontrado";
        (ClientesUsecases.BuscarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");

        const result = await ClientesController.BuscarClientePorCpf(dbConnection, "12345678901");

        expect(ClientesUsecases.BuscarClientePorCpfUsecase).toHaveBeenCalledWith({ clienteGateway: dbConnection.gateways.clienteGateway, cpfTexto: "12345678901" });
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });
    
    test("AtualizarClientePorCpf Deve retornar msg de erro quando cliente não foi atualizado", async () => {
        const mensagem = "Cliente não encontrado";
        (ClientesUsecases.AtualizarClientePorCpfUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");

        const result = await ClientesController.AtualizarClientePorCpf(dbConnection, "12345678901", "João Atualizado", "joao@teste.com");

        expect(ClientesUsecases.AtualizarClientePorCpfUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João Atualizado", "joao@teste.com");
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });

    test("CadastrarCliente Deve retornar msg de erro quando cliente não foi criado", async () => {
        const mensagem = "Erro ao cadastrar cliente";
        (ClientesUsecases.CadastrarClienteUsecase as jest.Mock).mockResolvedValue({ cliente: undefined, mensagem });
        (ClienteAdapter.adaptClienteJsonError as jest.Mock).mockReturnValue("error JSON");
    
        const result = await ClientesController.CadastrarCliente(dbConnection, "12345678901", "João", "joao@teste.com");
    
        expect(ClientesUsecases.CadastrarClienteUsecase).toHaveBeenCalledWith(dbConnection.gateways.clienteGateway, "12345678901", "João", "joao@teste.com");
        expect(ClienteAdapter.adaptClienteJsonError).toHaveBeenCalledWith(mensagem);
        expect(result).toBe("error JSON");
    });

});

