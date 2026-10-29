import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'AI Free Directory <onboarding@resend.dev>',
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