export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.MAILERLITE_API_KEY;
  const groupId = env.MAILERLITE_GROUP_ID;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let email;
  try {
    const body = await request.json();
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = { email };
  if (groupId) payload.groups = [groupId];

  const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  // 200 = already subscribed, 201 = newly created — both are success
  if (mlRes.ok) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errBody = await mlRes.json().catch(() => ({}));
  const message = errBody?.message ?? 'Subscription failed';
  return new Response(JSON.stringify({ error: message }), {
    status: mlRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
