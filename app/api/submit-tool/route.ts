import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { turnstileToken, formData } = body;

    // 1. VÉRIFICATION DU CAPTCHA AUPRÈS DE CLOUDFLARE
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

    // Si Cloudflare dit que ce n'est pas valide, on s'arrête là
    if (!cloudflareData.success) {
      return NextResponse.json({ error: "Vérification anti-bot échouée. Êtes-vous un robot ?" }, { status: 400 });
    }

    // 2. CALCULER LA LANGUE
    const descFr = formData.description_fr?.trim() || null;
    const descEn = formData.description_en?.trim() || null;
    
    let language = 'both';
    if (descFr && !descEn) language = 'fr';
    if (!descFr && descEn) language = 'en';

    // 3. INSERTION DANS SUPABASE
    const { error } = await supabase
      .from('tools')
      .insert([
        { 
          name: formData.name, 
          url: formData.url, 
          description_fr: descFr,
          description_en: descEn,
          categories: formData.categories, // <-- On passe le tableau ici
          pricing: formData.pricing,
          contributor: formData.contributor,
          status: 'pending',
          language: language
        }
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. SUCCÈS
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}