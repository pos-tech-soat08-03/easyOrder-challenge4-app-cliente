

export class CpfValueObject {

    private readonly value: string;

    constructor(value: string) {

        if (value.length !== 11 || !CpfValueObject.validaEntradaCPF({ cpf: value })) {
            throw new Error('Entrada de CPF inválida. CPF deve ser inserido sem formatação (11 dígitos)');
        }
        this.value = value;
    }

    static validaEntradaCPF ({ cpf }: { cpf: string; }): boolean {
        const cpfNaoFormatadoRegex = /^\d{11}$/;
        return cpfNaoFormatadoRegex.test(cpf);
    }
    
    getValue(): string {
        return this.value;
    }

    static formataCPF ({ cpf }: { cpf: string; }): string {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    getFormatado(): string {
        return CpfValueObject.formataCPF({ cpf: this.value });
    }
}