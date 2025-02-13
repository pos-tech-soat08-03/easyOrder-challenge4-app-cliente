import { EmailValueObject } from '../../../../../easyorder/Core/Entity/ValueObject/EmailValueObject';

describe('Testes unitários EmailValueObject', () => {

    it('EmailValueObject constructor Deve criar um email válido', () => {
        const email = 'test.completo-nome+alias@example-completo.com';
        const emailValueObject = new EmailValueObject(email);
        expect(emailValueObject.getValue()).toBe(email);
    });

    it('EmailValueObject constructor Deve retornar erro com formato inválido de email - email sem @', () => {
        const invalidEmail = 'invalidemail.com';
        expect(() => new EmailValueObject(invalidEmail)).toThrow('O email deve estar no formato a-z@az-.az');
    });

    it('EmailValueObject constructor Deve retornar erro com formato inválido de email - email sem domínio', () => {
        const invalidEmail = 'invalid@';
        expect(() => new EmailValueObject(invalidEmail)).toThrow('O email deve estar no formato a-z@az-.az');
    });

    it('EmailValueObject constructor Deve retornar erro com formato inválido de email - email com espaço', () => {
        const invalidEmail = 'invalid @example.com';
        expect(() => new EmailValueObject(invalidEmail)).toThrow('O email deve estar no formato a-z@az-.az');
    });

    it('EmailValueObject constructor Deve retornar erro caso email seja vazio', () => {
        const email = '';
        const emailValueObject = new EmailValueObject(email);
        expect(emailValueObject.getValue()).toBe(email);
    });
    
});