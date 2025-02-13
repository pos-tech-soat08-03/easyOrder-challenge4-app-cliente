import express from "express";
import request from "supertest";
import { ApiClientes } from "../../../../easyorder/Infrastructure/Api/ApiClientes";
import { IDbConnection } from "../../../../easyorder/Core/Interfaces/IDbConnection";
import { ClientesController } from "../../../../easyorder/Application/Controller/ClientesController";

jest.mock("../../../../easyorder/Application/Controller/ClientesController");

describe("Testes Unitários ApiClientes", () => {
    let app: express.Express;
    let dbconnection: IDbConnection;

    beforeEach(() => {
        app = express();
        dbconnection = {} as IDbConnection;
        ApiClientes.start(dbconnection, app);
    });

    describe("POST /cliente/cadastrar", () => {
        it("Deve retornar 200 e Json com dados do Cliente em cadastro bem sucedido", async () => {
            const clientePayload = { id: "1", cpf: "123.456.789-10", nome: "Nome do Cliente", email: "exemplo.email@dominio.com" };
            (ClientesController.CadastrarCliente as jest.Mock).mockResolvedValue(clientePayload);

            const response = await request(app)
                .post("/cliente/cadastrar")
                .send({ cpf: "12345678910", nome: "Nome do Cliente", email: "exemplo.email@dominio.com" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(clientePayload);
        });

        it("Deve retornar 400 quando o body com dados do cadastro não for informado", async () => {
            const response = await request(app)
                .post("/cliente/cadastrar")
                .send({});

            expect(response.status).toBe(400);
            expect(response.text).toBe("Erro: Nenhum dado informado.");
        });
    });

    describe("PUT /cliente/atualizar", () => {
        it("Deve retornar 200 e Json com dados do Cliente em atualização bem sucedida", async () => {
            const clientePayload = { id: "1", cpf: "123.456.789-10", nome: "Nome Atualizado", email: "exemplo.atualizado@dominio.com" };
            (ClientesController.AtualizarClientePorCpf as jest.Mock).mockResolvedValue(clientePayload);

            const response = await request(app)
                .put("/cliente/atualizar")
                .send({ cpf: "12345678910", nome: "Nome Atualizado", email: "exemplo.atualizado@dominio.com" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(clientePayload);
        });

        it("Deve retornar 400 quando o body com dados da atuaização não for informada", async () => {
            const response = await request(app)
                .put("/cliente/atualizar")
                .send({});

            expect(response.status).toBe(400);
            expect(response.text).toBe("Erro: Nenhum dado informado.");
        });
    });

    describe("GET /cliente/listar", () => {
        it("Deve retornar 200 e a lista de Clientes", async () => {
            const clientesPayload = [{ id: "1", cpf: "123.456.789-00", nome: "Fulano de Tal", email: "teste@teste.com" }];
            (ClientesController.ListarClientes as jest.Mock).mockResolvedValue(clientesPayload);

            const response = await request(app)
                .get("/cliente/listar");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(clientesPayload);
        });

        it("Deve retornar 400 em caso de erro ao Listar Clientes", async () => {
            (ClientesController.ListarClientes as jest.Mock).mockRejectedValue(new Error("Erro inesperado"));

            const response = await request(app)
                .get("/cliente/listar");

            expect(response.status).toBe(400);
            expect(response.text).toBe("Erro: Erro inesperado");
        });
    });

    describe("GET /cliente/auth/:cpf", () => {
        it("Deve retornar 200 e Json com dados do Cliente em autenticação bem sucedida", async () => {
            const clientePayload = { id: "1", cpf: "123.456.789-10", nome: "Nome do Cliente", email: "exemplo.email@dominio.com" };
            (ClientesController.BuscarClientePorCpf as jest.Mock).mockResolvedValue(clientePayload);

            const response = await request(app)
                .get("/cliente/auth/12345678910");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(clientePayload);
        });

        it("Deve retornar 404 caso o CPF não seja enviado", async () => {
            const response = await request(app)
                .get("/cliente/auth/");
            expect(response.status).toBe(404);
        });

        it("Deve retornar 400 caso o cliente não seja encontrado", async () => {
                (ClientesController.BuscarClientePorCpf as jest.Mock).mockRejectedValue(new Error("Cliente não encontrado."));

                const response = await request(app)
                    .get("/cliente/auth/12345678910");

                expect(response.status).toBe(400);
                expect(response.text).toBe("Erro: Cliente não encontrado.");
            });
        });

});