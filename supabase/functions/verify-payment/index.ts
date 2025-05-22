
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
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    // Validate that we're using a secret key (starts with sk_)
    if (!stripeSecretKey.startsWith('sk_')) {
      throw new Error('Invalid Stripe key format. Must use a secret key (sk_)');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    console.log('Verifying payment...');
    
    // Parse the request to get the session_id
    const requestData = await req.json();
    const { session_id } = requestData;

    console.log('Session ID received:', session_id);

    if (!session_id) {
      throw new Error('No session ID provided');
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Session retrieved:', session.id, 'Status:', session.payment_status);
    
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
      JSON.stringify({ 
        error: error.message,
        details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error'
      }),
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
