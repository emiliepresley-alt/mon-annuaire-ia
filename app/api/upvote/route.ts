import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // On récupère les votes actuels
    const { data: tool, error: fetchError } = await supabase
      .from('tools')
      .select('upvotes')
      .eq('id', toolId)
      .single();

    if (fetchError || !tool) {
      return NextResponse.json({ error: 'Outil introuvable' }, { status: 404 });
    }

    // On ajoute +1
    const newVotes = (tool.upvotes || 0) + 1;

    const { error: updateError } = await supabase
      .from('tools')
      .update({ upvotes: newVotes })
      .eq('id', toolId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, upvotes: newVotes });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}