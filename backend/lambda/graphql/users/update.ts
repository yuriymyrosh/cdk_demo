import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from '../../interfaces/user';

interface UpdateExpressionValues {
  updateExpression: DocumentClient.UpdateExpression,
  expressionAttributeNames: DocumentClient.ExpressionAttributeNameMap,
  expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
}

const docClient = new DocumentClient();

export async function update(user: User) {
  const updateExpression = createUpdateExpression(user);
  const params: DocumentClient.UpdateItemInput = {
    Key: { id: user.id },
    TableName: process.env?.TABLE ?? "",
    UpdateExpression: updateExpression.updateExpression,
    ExpressionAttributeNames: updateExpression.expressionAttributeNames,
    ExpressionAttributeValues: updateExpression.expressionAttributeValues,
  }
  try {
    await docClient.update(params).promise();
    return user;
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err
  }

}

function createUpdateExpression(user: User): UpdateExpressionValues {
  const keys = ['name', 'email'];
  let updateExpression: string = 'set ',
    expressionAttributeNames: DocumentClient.ExpressionAttributeNameMap = {},
    expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = {};
  keys.forEach((key: string) => {
    updateExpression += `#${key} = :${key},`
    expressionAttributeNames[`#${key}`] = key;
    //@ts-ignore
    expressionAttributeValues[`:${key}`] = user[key];
  });

  updateExpression = updateExpression.slice(0, -1);
  return {
    updateExpression,
    expressionAttributeNames,
    expressionAttributeValues
  }
}
