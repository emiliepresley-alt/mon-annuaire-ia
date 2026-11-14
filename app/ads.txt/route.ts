import { NextResponse } from 'next/server';

export async function GET() {
  // Remplace 'pub-XXXXXXXXXXXXXXXX' par ton vrai ID éditeur (sans le 'ca-' devant)
  const content = `google.com, pub-0451071798143683, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}