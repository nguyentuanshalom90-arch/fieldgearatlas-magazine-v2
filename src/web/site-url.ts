export function getSiteUrl(){
  const raw=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3004";
  return raw.replace(/\/$/,"");
}
