// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // This is needed for browser preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { resource_id } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the (anonymous) user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check if the user has already liked this resource
    const { data: existingLike, error: selectError } = await supabase
      .from("likes")
      .select("id")
      .eq("resource_id", resource_id)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      // User has liked it, so UNLIKE (delete the row)
      await supabase.from("likes").delete().eq("id", existingLike.id);

      return new Response(JSON.stringify({ status: "unliked" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // User has not liked it, so LIKE (insert the row)
      await supabase
        .from("likes")
        .insert({ resource_id: resource_id, user_id: user.id });

      return new Response(JSON.stringify({ status: "liked" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
