import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
  const newEvent = {
    eventId:         "evt_" + Date.now(),
    title:           event.title,
    description:     event.description,
    date:            event.date,
    location:        event.location,
    capacity:        Number(event.capacity),
    registeredCount: 0,
    status:          "active",
    createdAt:       new Date().toISOString()
  };

  await client.send(new PutItemCommand({
    TableName: "Events",
    Item: marshall(newEvent)
  }));

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Event created!", event: newEvent })
  };
};