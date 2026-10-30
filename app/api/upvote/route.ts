import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // On s'assure que l'ID est bien un nombre (integer)
    const numericId = parseInt(toolId, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    // Appel de la fonction avec un nombre
    const { error } = await supabase.rpc('increment_upvote', { tool_id: numericId });

    if (error) {
      console.error("Erreur Supabase RPC:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}