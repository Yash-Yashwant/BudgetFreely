import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      try {
        await ensureAppUser({
          id: data.user.id,
          email: data.user.email,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            null,
          image: data.user.user_metadata?.avatar_url ?? null,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "access_denied";
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(message)}`,
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
