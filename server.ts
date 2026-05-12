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
  const { name, email, model, service, dateTime, message } = req.body;

  if (!name || !email || !model || !service || !dateTime) {
    return res.status(400).json({ 
      error: "Missing required fields", 
      received: { name, email, model, service, dateTime } 
    });
  }

  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: "onboarding@resend.dev",
      to: ["Gurbir.dhaliwxl14@gmail.com"],
      subject: `New Detailing Booking: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1a1a1a;">New Detailing Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Vehicle:</strong> ${model}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Requested Date/Time:</strong> ${dateTime}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${message || "No message provided."}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(error.statusCode || 500).json({ 
        error: error.name || "Resend failed to send email", 
        details: error.message || error,
        raw: error
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error Detail:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Internal Server Error",
      stack: error instanceof Error ? error.stack : undefined
    });
  }
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
