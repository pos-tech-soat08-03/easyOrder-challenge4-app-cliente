import { jest } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import { ClienteEntity } from '../../../../easyorder/Core/Entity/ClienteEntity';
import { CpfValueObject } from '../../../../easyorder/Core/Entity/ValueObject/CpfValueObject';
import { EmailValueObject } from '../../../../easyorder/Core/Entity/ValueObject/EmailValueObject';

jest.mock('uuid');

describe('Testes unitários ClienteEntity', () => {
    const mockCpf = new CpfValueObject('12345678900');
    const mockEmail = new EmailValueObject('teste@example.com');
    const mockNome = 'John Doe';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ClienteEntity constructor Deve criar um cliente com id existente', () => {
        const mockId = uuidv4();
        const cliente = new ClienteEntity(mockCpf, mockNome, mockEmail, mockId);

        expect(cliente.getId()).toBe(mockId);
        expect(cliente.getCpf()).toBe(mockCpf);
        expect(cliente.getNome()).toBe(mockNome);
        expect(cliente.getEmail()).toBe(mockEmail);
    });

    it('ClienteEntity constructor Deve criar um cliente com o id novo quando não especificado', () => {
        const mockGeneratedId = 'id-novo-xyz-1234';
        (uuidv4 as jest.Mock).mockReturnValue(mockGeneratedId);
        
        const cliente = new ClienteEntity(mockCpf, mockNome, mockEmail);

        expect(cliente.getId()).toBe(mockGeneratedId);
        expect(cliente.getCpf()).toBe(mockCpf);
        expect(cliente.getNome()).toBe(mockNome);
        expect(cliente.getEmail()).toBe(mockEmail);
    });

});