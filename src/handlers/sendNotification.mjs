import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "ap-south-1" });

export const handler = async (event) => {
  const { userName, userEmail, eventTitle, eventDate, eventLocation, qrCodeUrl } = event;

  await client.send(new SendEmailCommand({
    Source: "vineetvineet2003@gmail.com",
    Destination: { ToAddresses: [userEmail] },
    Message: {
      Subject: { Data: "Your registration is confirmed! - " + eventTitle },
      Body: {
        Html: {
          Data: `
            <h2>Hi ${userName}!</h2>
            <p>You are successfully registered for <strong>${eventTitle}</strong>.</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <br/>
            <p>Your QR code for entry:</p>
            <img src="${qrCodeUrl}" alt="QR Code" width="200"/>
            <br/>
            <p>Show this QR code at the event entrance.</p>
          `
        }
      }
    }
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Email sent successfully!" })
  };
};