import { ClienteGateway } from "../../../Application/Gateway/ClienteGateway";
import { IDbConnection } from "../../../Core/Interfaces/IDbConnection";
import { Gateways } from "../../../Core/Types/Gateways";
import { ConnectionInfo } from "../../../Core/Types/ConnectionInfo";

export class MySQLConnection implements IDbConnection {
  readonly gateways: Gateways;
  readonly dbConnection: ConnectionInfo;
  constructor(dbConnection: ConnectionInfo) {
    this.dbConnection = dbConnection;
    this.gateways = {
      clienteGateway: new ClienteGateway(this.dbConnection)
    };
  }
}
