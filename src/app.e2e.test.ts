import axios from "axios";
import { exit } from "process";

const BASE_URL = "http://localhost:3000";

describe("Teste Microserviço Pedido", () => {
  let clienteId: string;
  let cpfAleatorio: string;

  test("(/health) Healthcheck do Serviço", async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/health`,
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("status");
      expect(response.data.status).toEqual("UP");

    } catch (error: any) {
      console.error("Teste interrompido. Falha no healthcheck: " + error.message);
      exit(1);
    }
  });

  test("(/cliente/cadastrar) Cria um Novo Cliente com CPF aleatório", async () => {
    cpfAleatorio = "";
    const tamanho = 11;
    const caracteres = "0123456789";

    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      cpfAleatorio += caracteres[indiceAleatorio];
    }

    try {
      const response = await axios.post(`${BASE_URL}/cliente/cadastrar`, {
        cpf: `${cpfAleatorio}`,
        nome: "João da Silva",
        email: "teste@teste.com",
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("cliente");
      expect(response.data.cliente).toHaveProperty("id");

      clienteId = response.data.cliente.id;
    } catch (error: any) {
      console.log(error.message);
    }
  });

  test("(/cliente/buscar/{cpf}) Busca Cliente por CPF", async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cliente/buscar/${cpfAleatorio}`,
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("cliente");
      expect(response.data.cliente).toHaveProperty("id");

      clienteId = response.data.cliente.id;
    } catch (error: any) {
      console.log(error.message);
    }
  });


});
