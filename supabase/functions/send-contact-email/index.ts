
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import nodemailer from "npm:nodemailer@6.9.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Parse the request (Payload from Database Webhook)
        const payload = await req.json();

        // Webhook payload structure: { type: 'INSERT', table: 'contact_requests', record: { ... }, ... }
        const record = payload.record;

        if (!record || !record.email) {
            throw new Error("No record found in payload");
        }

        // 2. Setup Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: Deno.env.get("SMTP_USER"),
                pass: Deno.env.get("SMTP_PASS"),
            },
        });

        // 3. Send Email to Admin (You)
        const mailOptions = {
            from: "GC2 Website <no-reply@gc2.com>",
            to: Deno.env.get("SMTP_USER"), // Send to yourself
            subject: `[GC2 Website] ${record.subject || 'Nouveau Message'}`,
            html: `
            <h2>Nouveau message reçu</h2>
            <p><strong>De:</strong> ${record.name} (${record.email})</p>
            <p><strong>Message:</strong></p>
            <pre style="background: #f4f4f4; padding: 10px; white-space: pre-wrap;">${record.message}</pre>
            <br>
            <p><a href="${Deno.env.get("SITE_URL") || 'http://localhost:5173'}/admin.html">Voir dans le Dashboard</a></p>
        `
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Email sent successfully" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
