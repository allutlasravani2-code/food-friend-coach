import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: string;
  content: string;
}

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  goal: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, profile } = await req.json() as { messages: Message[], profile: UserProfile };
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Calculate BMI
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    
    // Determine goal-specific advice
    const goalContext = profile.goal === 'lose_weight' 
      ? 'weight loss and calorie deficit'
      : profile.goal === 'gain_muscle'
      ? 'muscle building and protein intake'
      : 'healthy balanced nutrition';

    const systemPrompt = `You are a professional nutrition coach and dietitian. You're helping a ${profile.age}-year-old ${profile.gender} who weighs ${profile.weight}kg and is ${profile.height}cm tall (BMI: ${bmi.toFixed(1)}). Their goal is ${goalContext}.

Provide personalized, evidence-based nutrition advice that is:
- Friendly and encouraging, like a real coach
- Specific to their profile and goals
- Practical and actionable
- Based on sound nutritional science
- Focused on sustainable habits

When suggesting meal plans:
- Include approximate calorie counts
- List macronutrients (protein, carbs, fats)
- Provide specific food examples
- Consider their goal when calculating portions

Keep responses concise but helpful (2-3 paragraphs max unless they ask for detailed plans).`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in diet-coach function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
