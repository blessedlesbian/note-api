const request = require('supertest');
const app = require('../../server'); // ajuste o caminho conforme a estrutura do seu projeto

describe('Testes da API de notas', () => {
  test('GET /notes deve retornar 200', async () => {
    const response = await request(app).get('/notes');
    expect(response.statusCode).toBe(200);
  });
});
