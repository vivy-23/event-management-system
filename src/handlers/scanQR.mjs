import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
  const registrationId = event.registrationId;
  const eventId = event.eventId;

  const existing = await client.send(new GetItemCommand({
    TableName: "Registrations",
    Key: marshall({ registrationId, eventId })
  }));

  if (!existing.Item) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Registration not found" })
    };
  }

  const reg = unmarshall(existing.Item);

  if (reg.checkedIn) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Already checked in!" })
    };
  }

  await client.send(new UpdateItemCommand({
    TableName: "Registrations",
    Key: marshall({ registrationId, eventId }),
    UpdateExpression: "SET checkedIn = :t, checkedInAt = :ts",
    ExpressionAttributeValues: marshall({
      ":t": true,
      ":ts": new Date().toISOString()
    })
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Checked in successfully!", registrationId })
  };
};