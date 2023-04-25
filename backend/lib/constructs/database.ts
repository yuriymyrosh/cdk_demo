import { RemovalPolicy, Stack, aws_dynamodb } from "aws-cdk-lib";
import { Buildable } from "./construct";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export class DatabaseTable implements Buildable {

  private tableName = 'UsersTable';
  
  constructor(private readonly stack: Stack) {}

  build(): Table {
      return new aws_dynamodb.Table(this.stack, this.tableName, {
        tableName: this.tableName,
        partitionKey: {
          name: 'id',
          type: AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
      })
  }
}