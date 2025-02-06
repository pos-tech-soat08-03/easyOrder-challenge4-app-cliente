import { v4 as uuidv4 } from 'uuid';
import { CpfValueObject } from './ValueObject/CpfValueObject';
import { EmailValueObject } from './ValueObject/EmailValueObject';

export class ClienteEntity {
    private readonly id: string;
    private readonly nome: string;
    private readonly cpf: CpfValueObject;
    private readonly email: EmailValueObject;

    constructor(cpf: CpfValueObject, nome: string, email: EmailValueObject, id?: string) {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;

        if (!id) {
            id = uuidv4();
        }

        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    getNome(): string {
        return this.nome;
    }

    getEmail(): EmailValueObject {
        return this.email;
    }

    getCpf(): CpfValueObject {
        return this.cpf;
    }
}