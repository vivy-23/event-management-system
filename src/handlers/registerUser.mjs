import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

export const handler = async (event) => {
  const registrationId = "reg_" + Date.now();
  const eventId = event.eventId;

  const registration = {
    registrationId: registrationId,
    eventId:        eventId,
    userId:         event.userId,
    userEmail:      event.userEmail,
    userName:       event.userName,
    registeredAt:   new Date().toISOString(),
    checkedIn:      false,
    checkedInAt:    null,
    qrCodeUrl:      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + registrationId
  };

  await client.send(new PutItemCommand({
    TableName: "Registrations",
    Item: marshall(registration)
  }));

  await client.send(new UpdateItemCommand({
    TableName: "Events",
    Key: marshall({ eventId: eventId }),
    UpdateExpression: "SET registeredCount = registeredCount + :inc",
    ExpressionAttributeValues: marshall({ ":inc": 1 })
  }));

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Registration successful!",
      registrationId: registrationId,
      qrCodeUrl: registration.qrCodeUrl
    })
  };
};