import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { ConstructBuilder } from "./construct-builder";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class DatabaseTable implements ConstructBuilder {
  private tableName = "UsersTable";

  constructor(private readonly stack: Stack) {}

  build(): Table {
    return new Table(this.stack, this.tableName, {
      tableName: this.tableName,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
