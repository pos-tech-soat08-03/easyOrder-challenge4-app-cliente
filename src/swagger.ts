const swaggerAutogen = require('swagger-autogen')({ language: 'pt-BR', openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Microserviço de Clientes | easyOrder 4.0 Documentação da API.',
    description: 'easyOrder - Tech Challenge (4) da Pos Tech SOAT - Microserviço de Clientes'
  },

  schemes: ['http'],

  components: {
    securitySchemes:{
        bearerAuth: {
            type: 'http',
            scheme: 'bearer'
        }
    }
  },  

  '@definitions': {
    ID: {
      type: "string",
      minLength: 36,
      maxLength: 36,
      format: "uuid",
      example: '29a81eeb-d16d-4d6c-a86c-e13597667307',
    },
    Cliente: {
      type: "object",
      properties: {
        cpf: {
          type: "string", 
          minLength: 11,
          maxLength: 11,
          example: '12345678910'
        },
        nome: {
          type: "string",
          minLength: 0,
          maxLength: 255,
          example: 'Nome do cliente'
        },
        email: {
          type: "string",
          minLength: 0,
          maxLength: 255,
          example: 'exemplo.email@dominio.com'
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./app.ts', './easyorder/Infrastructure/Api/*.ts'];

swaggerAutogen(outputFile, routes, doc);