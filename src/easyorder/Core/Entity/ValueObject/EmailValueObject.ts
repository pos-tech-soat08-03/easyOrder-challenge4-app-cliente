

export class EmailValueObject {

    private readonly value: string;

    constructor(value: string) {

        if (value) {
            if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).exec(value)) {
                throw new Error('O email deve estar no formato a-z@az-.az');
            }
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}