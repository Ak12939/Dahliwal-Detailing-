import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import cors from "cors";

const app = express();
const PORT = 3000;

// Initialize Resend lazily
let resend: Resend | null = null;
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured in environment variables");
  }
  if (!resend) {
    resend = new Resend(apiKey);
  }
  return resend;
};

app.use(cors());
app.use(express.json());

// Booking API Endpoint (Aliased for backward compatibility)
app.post(["/api/send", "/api/book"], async (req, res) => {
  console.log("Received booking request:", req.body);
  const { name, email, model, service, dateTime, message } = req.body;

  if (!name || !email || !model || !service || !dateTime) {
    return res.status(400).json({ 
      error: "Missing required fields", 
      received: { name, email, model, service, dateTime } 
    });
  }

  try {
    const client = getResend();
    // Using onboarding@resend.dev which only works if sending to the account owner in sandbox mode
    const recipient = process.env.ADMIN_EMAIL || "Gurbir.dhaliwxl14@gmail.com";
    
    console.log(`Attempting to send email from onboarding@resend.dev to ${recipient}`);

    const { data, error } = await client.emails.send({
      from: "onboarding@resend.dev",
      to: [recipient],
      subject: `New Detailing Booking: ${name}`,
      text: `New booking request from ${name} (${email}) for ${model} - ${service} on ${dateTime}. Message: ${message || "No message."}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Detailing Booking Request</h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Vehicle:</strong> ${model}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Requested Date/Time:</strong> ${dateTime}</p>
          </div>
          <div style="margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 4px;">
            <p style="margin-top: 0;"><strong>Message:</strong></p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message || "No message provided."}</p>
          </div>
          <p style="margin-top: 30px; font-size: 10px; color: #999; text-align: center;">Sent via Dhaliwal Detailing Booking System</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error Object:", JSON.stringify(error, null, 2));
      // Return 400 for validation errors to help debugging, but keep status detail
      return res.status(error.name === "validation_error" ? 400 : 500).json({ 
        error: error.name || "Resend failed to send email", 
        message: error.message || "An unknown validation error occurred",
        details: error,
        suggestion: error.name === "validation_error" ? "In sandbox mode, you can only send to the email address associated with your Resend account." : undefined
      });
    }

    console.log("Email sent successfully:", data);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error Detail:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Internal Server Error",
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
