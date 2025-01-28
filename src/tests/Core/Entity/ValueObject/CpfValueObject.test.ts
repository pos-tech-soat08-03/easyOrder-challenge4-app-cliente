import { CpfValueObject } from '../../../../easyorder/Core/Entity/ValueObject/CpfValueObject';

describe('Objeto de Valor - CPF', () => {

    it('deve criar um CPF válido', () => {
        const validCpf = '12345678910';
        const cpfValueObject = new CpfValueObject(validCpf);
        expect(cpfValueObject.getValue()).toBe(validCpf);
    });

    it('CPF deve retornar  erro se não tem 11 caracteres', () => {
        const invalidCpf = '1234567890';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('CPF deve retornar erro se contém digitos não numérios', () => {
        const invalidCpf = '1234567890a';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('CPF deve retornar erro se vazio', () => {
        const invalidCpf = '';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('deve formatar corretamente um CPF válido', () => {
        const validCpf = '12345678910';
        const cpfValueObject = new CpfValueObject(validCpf);
        expect(cpfValueObject.getFormatado()).toBe('123.456.789-10');
    });

    it('deve lançar erro ao tentar formatar um CPF inválido', () => {
        const invalidCpf = '123456789-0';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

});