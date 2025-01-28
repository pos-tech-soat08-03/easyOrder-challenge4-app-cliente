import { ClienteEntity } from "../../Entity/ClienteEntity";
import { CpfValueObject } from "../../Entity/ValueObject/CpfValueObject";

export interface ClienteGatewayInterface {
    listarClientes(): Promise<ClienteEntity[] | undefined>;
    adicionarCliente(cliente: ClienteEntity): Promise<ClienteEntity | undefined>;
    atualizarCliente(cliente: ClienteEntity, novoCliente: ClienteEntity): Promise<ClienteEntity | undefined>;
    buscarClientePorCpf(cpf: CpfValueObject): Promise<ClienteEntity | undefined>;
}
