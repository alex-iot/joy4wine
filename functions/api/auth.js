export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Step 1 — no code yet, redirect to GitHub for authorisation
  if (!code) {
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('scope', 'repo');
    githubAuthUrl.searchParams.set('redirect_uri', 'https://www.joy4wine.com/api/auth');
    return Response.redirect(githubAuthUrl.toString(), 302);
  }

  // Step 2 — GitHub returned with code, exchange for token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return new Response(data.error_description, { status: 400 });
  }

  const token = data.access_token;
  const message = JSON.stringify({ token, provider: 'github' });

  return new Response(
    `<!DOCTYPE html>
    <html>
    <body>
    <script>
      window.opener.postMessage(
        'authorization:github:success:' + ${JSON.stringify(message)},
        'https://www.joy4wine.com'
      );
      window.close();
    <\/script>
    </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
