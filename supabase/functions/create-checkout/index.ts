
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

    const body = await req.json();
    const { reservaId, nombre, total, productos, mesa, fecha } = body;

    console.log('Creating Stripe checkout session for reserva:', reservaId);

    // Format product description
    const productNames = productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ');
    const description = `Mesa: ${mesa.nombre}, Fecha: ${fecha}, Productos: ${productNames}`;

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Reserva en The Normal Club',
              description: description.substring(0, 255), // Limit description length
            },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/confirmacion?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.get('origin')}/confirmacion?canceled=true`,
      metadata: {
        reserva_id: reservaId
      }
    });

    console.log('Session created successfully:', session.id);

    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update the reservation with the Stripe session ID
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ stripe_session_id: session.id })
      .eq('id', reservaId);

    if (updateError) {
      console.error('Error updating reservation with session ID:', updateError);
    }

    // Store payment information in the payments table
    await supabase.from('payments').insert({
      user_name: nombre,
      reservation_id: reservaId,
      amount: Math.round(total * 100),
      stripe_session_id: session.id,
    });

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
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
