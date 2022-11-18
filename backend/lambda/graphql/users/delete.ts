import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamodb = new DocumentClient()

export async function deleteUser(id: string) {
  try {
    await dynamodb.delete({
      'TableName': process.env.TABLE ?? '',
      'Key': {
        'id': id
      }
    }).promise();

    return {deleted: true}
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
}
