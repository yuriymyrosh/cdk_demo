import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from '../../interfaces/user';

const docClient = new DocumentClient();

export async function create(user: User) {
  const params: DocumentClient.PutItemInput = {
    TableName: process.env?.TABLE ?? "",
    Item: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  try {
    await docClient.put(params).promise();
    return user;
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err
  }
}
