import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const docClient = new DocumentClient();

export async function getById(id: string) {
  const params = {
    TableName: process.env.TABLE ?? '',
    Key: { id }
  }
  try {
    const { Item } = await docClient.get(params).promise()
    return Item
  } catch (err) {
    console.log('DynamoDB error when calling getById(): ', id, err)
    throw err
  }
}
