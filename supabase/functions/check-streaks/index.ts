import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: activeProfiles } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('subscription_active', true);

    if (!activeProfiles) {
      return new Response(
        JSON.stringify({ message: 'No active profiles found' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const results = {
      checked: 0,
      penalties: 0,
      streaks_reset: 0,
    };

    for (const profile of activeProfiles) {
      results.checked++;

      if (!profile.last_session_date) {
        continue;
      }

      const lastSessionDate = profile.last_session_date;

      if (lastSessionDate < yesterday) {
        const { data: existingPenalty } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', profile.id)
          .eq('missed_date', yesterday)
          .eq('type', 'penalty')
          .maybeSingle();

        if (!existingPenalty) {
          await supabase.from('transactions').insert({
            user_id: profile.id,
            type: 'penalty',
            amount: 0.50,
            currency: 'GBP',
            status: 'pending',
            missed_date: yesterday,
            metadata: {
              previous_streak: profile.streak_count,
              reason: 'missed_daily_session',
            },
          });

          results.penalties++;
        }

        if (profile.streak_count > 0) {
          await supabase
            .from('streak_records')
            .insert({
              user_id: profile.id,
              streak_length: profile.streak_count,
              start_date: new Date(Date.now() - profile.streak_count * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              end_date: lastSessionDate,
              completed_30_days: profile.streak_count >= 30,
            });

          await supabase
            .from('user_profiles')
            .update({ streak_count: 0 })
            .eq('id', profile.id);

          results.streaks_reset++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error checking streaks:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});