import { CfnOutput, Stack } from "aws-cdk-lib";
import { Buildable } from "./construct";
import { GraphqlApi, AuthorizationType, SchemaFile } from "aws-cdk-lib/aws-appsync";

export class AppSync implements Buildable {
  private readonly id = 'GraphQl'

  constructor(private readonly stack: Stack) {}

  build() {
    const appsync = new GraphqlApi(this.stack, this.id, {
      name: 'graphQl',
      schema: SchemaFile.fromAsset('schema/schema.graphql'),
      xrayEnabled: true,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      },
    });

    new CfnOutput(this.stack, "aws_appsync_graphqlEndpoint", {
      value: appsync.graphqlUrl
    });


    new CfnOutput(this.stack, "aws_appsync_apiKey", {
      value: appsync.apiKey || ''
    });

    return appsync;
  } 
}