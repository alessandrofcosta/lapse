import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://alessandrofcosta.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
]

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const headers = corsHeaders(origin)

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
  }

  let body: { message?: unknown; character?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  const { message, character } = body

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400, headers })
  }

  const webhookUrl =
    character === 'npc'
      ? process.env.DISCORD_NPC_WEBHOOK_URL
      : process.env.DISCORD_PLAYER_WEBHOOK_URL

  if (!webhookUrl) {
    console.error(`Discord webhook not configured for character type: ${character}`)
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500, headers }
    )
  }

  const discordRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  })

  if (!discordRes.ok) {
    const text = await discordRes.text()
    console.error('Discord webhook error:', discordRes.status, text)
    return NextResponse.json({ error: 'Discord error' }, { status: 502, headers })
  }

  return NextResponse.json({ ok: true }, { headers })
}
