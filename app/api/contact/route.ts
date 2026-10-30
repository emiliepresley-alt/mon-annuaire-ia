import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message, website, turnstileToken } = await request.json();

    // 🛡️ 1. VÉRIFICATION DU HONEYPOT (Si rempli, c'est un bot)
    if (website && website.length > 0) {
      // On renvoie un faux succès au bot pour qu'il ne sache pas qu'il a été détecté
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    // 🛡️ 2. VÉRIFICATION DU CAPTCHA CLOUDFLARE
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      return NextResponse.json({ error: "Clé secrète Cloudflare manquante." }, { status: 500 });
    }

    const formDataToSend = new FormData();
    formDataToSend.append('secret', turnstileSecret);
    formDataToSend.append('response', turnstileToken);

    const cloudflareRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formDataToSend,
    });

    const cloudflareData = await cloudflareRes.json();

    if (!cloudflareData.success) {
      return NextResponse.json({ error: "Vérification anti-bot échouée." }, { status: 400 });
    }

    // ✉️ 3. ENVOI DE L'EMAIL AVEC RESEND
    const { error } = await resend.emails.send({
      from: 'AI Free Directory <contact@aifreedirectory.com>',
      to: 'contact@aifreedirectory.com',
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <div style="font-family: sans-serif; background: #0b0c10; color: #e2e8f0; padding: 20px; border-radius: 8px;">
          <h2 style="color: #a855f7;">Nouveau message depuis AI Free Directory</h2>
          <p><strong style="color: #a855f7;">Nom :</strong> ${name}</p>
          <p><strong style="color: #a855f7;">Email :</strong> ${email}</p>
          <hr style="border-color: #1e293b; margin: 20px 0;" />
          <p><strong style="color: #a855f7;">Message :</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}