
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Parse the request to get the session_id
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error('No session ID provided');
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update payment status in database
    await supabase
      .from('payments')
      .update({ 
        status: session.payment_status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_session_id', session_id);

    return new Response(
      JSON.stringify({ 
        status: session.payment_status,
        customer_email: session.customer_details?.email || null,
        payment_intent: session.payment_intent || null
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
