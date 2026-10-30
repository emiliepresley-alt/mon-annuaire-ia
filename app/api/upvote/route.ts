import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { toolId } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    // On appelle la fonction SQL qui fait +1
    const { error } = await supabase.rpc('increment_upvote', { tool_id: toolId });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}