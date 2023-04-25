import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DatabaseTable } from './constructs/database';
import { AppSync } from './constructs/appsync';
import { AppsyncLambda } from './constructs/appsync-lambda';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new DatabaseTable(this).build();
    const appsync = new AppSync(this).build();
    const appSyncLambda = new AppsyncLambda(this, table.tableName, appsync).build();

    table.grantFullAccess(appSyncLambda);
  }
}
