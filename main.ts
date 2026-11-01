Deno.serve(async (req) => {
  const url = new URL(req.url);
  const fid = url.searchParams.get("fid") || url.searchParams.get("id");
  if (!fid) return new Response(JSON.stringify({error:"no fid"}), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  const time = Date.now().toString();
  const raw = `fid=${fid}&time=${time}tB87#kPtkxqOS2`;
  const buf = await crypto.subtle.digest("MD5", new TextEncoder().encode(raw));
  const sign = [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  const body = JSON.stringify({fid, time, sign});
  const r = await fetch("https://wos-giftcode-api.centurygame.com/api/player", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "User-Agent":"Mozilla/5.0",
      "Origin":"https://wos-giftcode.centurygame.com",
      "Referer":"https://wos-giftcode.centurygame.com/"
    },
    body
  });
  const text = await r.text();
  return new Response(text, {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
});
