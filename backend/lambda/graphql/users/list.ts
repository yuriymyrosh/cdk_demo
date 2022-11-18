import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const docClient = new DocumentClient()

export async function list() {
  const params: DocumentClient.QueryInput = {
    TableName: process.env.TABLE ?? "",
  }

  const data = await docClient.scan(params).promise()
  if (data.Items === undefined) {
    throw new Error('No data items returned from Table')
  }

  return data.Items
}
