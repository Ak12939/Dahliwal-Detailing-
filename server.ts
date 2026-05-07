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

// Booking API Endpoint
app.post("/api/book", async (req, res) => {
  const { name, email, model, service, dateTime, message } = req.body;

  if (!name || !email || !model || !service || !dateTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const client = getResend();
    const { data, error } = await client.emails.send({
      from: "Dhaliwal Detailing <bookings@resend.dev>", // This needs to be a verified domain in production
      to: [process.env.ADMIN_EMAIL || "kalariaanuj2121@gmail.com"],
      subject: `New Detailing Booking: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Vehicle: ${model}
        Service: ${service}
        Requested Date/Time: ${dateTime}
        Message: ${message || "No message provided."}
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
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
