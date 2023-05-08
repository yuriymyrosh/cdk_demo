import { Duration, Stack } from "aws-cdk-lib";
import { ConstructBuilder } from "./construct-builder";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { GraphqlApi } from "aws-cdk-lib/aws-appsync";

export class AppsyncLambda implements ConstructBuilder {
  constructor(
    private readonly stack: Stack,
    private readonly tableName: string,
    private readonly graphQl: GraphqlApi
  ) {}

  build(): Function {
    const lambda = new Function(this.stack, "AppSyncLambda", {
      runtime: Runtime.NODEJS_14_X,
      handler: "main.handler",
      code: Code.fromAsset("lambda/graphql"),
      memorySize: 1024,
      timeout: Duration.seconds(899),
      functionName: this.stack.stackName + "-AppSyncLambda",
      environment: {
        TABLE: this.tableName
      }
    });

    const lambdaDs = this.graphQl.addLambdaDataSource('lambdaDatasource', lambda);

    lambdaDs.createResolver("getById", {
      typeName: "Query",
      fieldName: "getById"
    });

    lambdaDs.createResolver("list", {
      typeName: "Query",
      fieldName: "list"
    });

    lambdaDs.createResolver("createUser", {
      typeName: "Mutation",
      fieldName: "createUser"
    });

    lambdaDs.createResolver("updateUser", {
      typeName: "Mutation",
      fieldName: "updateUser"
    });

    lambdaDs.createResolver("deleteUser", {
      typeName: "Mutation",
      fieldName: "deleteUser"
    });

    return lambda;
  }
}
