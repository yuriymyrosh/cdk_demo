import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as aws_appsync from '@aws-cdk/aws-appsync-alpha';
import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new aws_dynamodb.Table(this, 'UsersTable', {
      tableName: 'UsersTable',
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const appsync = new aws_appsync.GraphqlApi(this, 'GraphQL', {
      name: 'graphQl',
      schema: aws_appsync.Schema.fromAsset('schema/schema.graphql'),
      xrayEnabled: true,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      },
    });

    new CfnOutput(this, "aws_appsync_graphqlEndpoint", {
      value: appsync.graphqlUrl
    });

    new CfnOutput(this, "aws_appsync_apiKey", {
      value: appsync.apiKey || ''
    });

    const appSyncLambda = new Function(this, 'AppSyncLambda', {
      runtime: Runtime.NODEJS_14_X,
      handler: 'main.handler',
      code: Code.fromAsset('lambda/graphql'),
      memorySize: 1024,
      timeout: Duration.seconds(899),
      functionName: this.stackName + '-AppSyncLambda',
      environment: {
        'TABLE': table.tableName,
      }
    });

    table.grantFullAccess(appSyncLambda);

    const lambdaDs = appsync.addLambdaDataSource('lambdaDatasource', appSyncLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getById"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "list"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createUser"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateUser"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteUser"
    });
  }
}
