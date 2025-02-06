import { CpfValueObject } from '../../../../easyorder/Core/Entity/ValueObject/CpfValueObject';

describe('Testes unitários CpfValueObject', () => {

    it('CpfValueObject constructor Deve criar um CPF válido', () => {
        const validCpf = '12345678910';
        const cpfValueObject = new CpfValueObject(validCpf);
        expect(cpfValueObject.getValue()).toBe(validCpf);
    });

    it('CpfValueObject constructor Deve retornar erro se não tiver 11 caracteres', () => {
        const invalidCpf = '1234567890';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('CpfValueObject constructor Deve retornar erro se contém digitos não numéricos', () => {
        const invalidCpf = '1234567890a';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('CpfValueObject constructor Deve retornar erro caso vazio', () => {
        const invalidCpf = '';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

    it('formataCPF Deve formatar corretamente um CPF válido', () => {
        const validCpf = '12345678910';
        const cpfValueObject = new CpfValueObject(validCpf);
        expect(cpfValueObject.getFormatado()).toBe('123.456.789-10');
    });

    it('formataCPF deve lançar erro ao tentar formatar um CPF inválido', () => {
        const invalidCpf = '123456789-0';
        expect(() => new CpfValueObject(invalidCpf)).toThrow('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
    });

});