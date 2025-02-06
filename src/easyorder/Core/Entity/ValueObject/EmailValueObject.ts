

export class EmailValueObject {

    private readonly value: string;

    constructor(value: string) {

        if (value) {
            if (!RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).exec(value)) {
                throw new Error('O email deve estar no formato a-z@az-.az');
            }
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}