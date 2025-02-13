import { expect } from '@jest/globals';
import { Bdd, Feature, val } from 'easy-bdd-tool-jest';
import { ClienteGatewayMock } from '../../easyorder/Infrastructure/DB/Mock/ClienteGatewayMock';
import { ClientesController } from '../../easyorder/Application/Controller/ClientesController';
import { IDbConnection } from '../../easyorder/Core/Interfaces/IDbConnection';

const feature = new Feature('Criar novo cliente', `
    Para gerenciar a lista de clientes
    Como um administrador ou totem de atendimento
    Eu quero poder adicionar novos clientes
`);

describe("BDD: Cadastro de Cliente", () => {
        let clienteGateway: ClienteGatewayMock;

        beforeAll(async () => {
                console.clear();
        });

        beforeEach(async () => {
                clienteGateway = new ClienteGatewayMock();

                jest.spyOn(console, "log").mockImplementation(() => { });
                jest.spyOn(console, "error").mockImplementation(() => { });
        });

        afterEach(async () => {
                jest.clearAllMocks();
        });

        Bdd(feature)
                .scenario('Deve criar um novo cliente')
                .given('Eu tenho os dados de um novo cliente (cpf, nome e email)')
                .when('Eu chamo a API para criar um novo cliente')
                .then('O novo cliente deve ser adicionado à lista de clientes')
                .and('A lista de clientes deve conter ao menos 1 cliente')
                .and('O novo cliente deve ser o último da lista')
                .example(
                        val('cliente', {
                                cpf: '12345678901',
                                nome: 'Cliente 1',
                                email: 'cliente1@example.com',
                        }),
                )
                .example(
                        val('cliente', {
                                cpf: '98765432100',
                                nome: 'Cliente 2',
                                email: 'cliente2@example.com',
                        }),
                )
                .run(async (ctx) => {
                        const cliente = ctx.example.val('cliente');

                        const dbConnection = {
                                gateways: {
                                        clienteGateway: clienteGateway,
                                },
                                dbConnection: {
                                        hostname: 'localhost',
                                        portnumb: 5432,
                                        database: 'testdb',
                                        databaseType: 'mysql', 
                                        username: 'testuser',
                                        password: 'testpassword',
                                },
                        } as IDbConnection;

                        const response = await ClientesController.CadastrarCliente(
                                dbConnection,
                                cliente.cpf,
                                cliente.nome,
                                cliente.email,
                        );

                        const json = JSON.parse(response);

                        expect(json.mensagem).toBe('Cliente cadastrado com sucesso.');
                        expect(json.cliente.nome).toBe(cliente.nome);
                });

});
