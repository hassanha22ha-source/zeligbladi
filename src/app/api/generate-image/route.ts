import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { replicate } from '@/lib/replicate';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { originalImageUrl, zellige, targetArea } = body;

        const openaiKey = process.env.OPENAI_API_KEY;
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        
        if (!openaiKey || !replicateToken) {
            return NextResponse.json({ error: 'API keys missing on server' }, { status: 500 });
        }

        if (!originalImageUrl || !zellige) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Fetch original image metadata
        const imageRes = await fetch(originalImageUrl);
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        const metadata = await sharp(imageBuffer).metadata();
        const originalWidth = metadata.width || 1024;
        const originalHeight = metadata.height || 1024;

        // 2. Generate optimized FLUX prompt using OpenAI LMM
        // This follows the user's specific system prompt for prompt engineering.
        const promptEngineeringResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert AI prompt engineer specializing in photorealistic interior design visualization and Stable Diffusion / FLUX image generation.

You will receive:
1. A photo/description of a room or wall.
2. A zelij tile product name, color palette, and pattern description.

Your task: Generate a single, highly optimized FLUX image generation prompt that shows the EXACT same room but with the zelij tiles applied to the walls.

RULES:
- Preserve everything: room layout, furniture, objects, lighting direction, shadows, perspective angle, time of day.
- Only change the wall surface texture/pattern to the zelij tiles.
- Be extremely specific about the zelij pattern geometry, colors, and material finish (glazed ceramic, matte, glossy).
- Include photographic quality keywords.
- Maximum 80 words.
- Output ONLY the prompt — no explanation, no preamble, no quotes.

PROMPT STRUCTURE TO FOLLOW:
[room type + perspective] + [zelij tile description: pattern, colors, finish] + [preserved elements: furniture, lighting] + [photography style keywords]`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Product: ${zellige.name}
Colors: ${zellige.color_palette || zellige.description}
Pattern: ${zellige.pattern_description || zellige.name}
Applying to: ${targetArea === 'wall' ? 'walls' : 'floors'}` }
                    ]
                }
            ],
            temperature: 0.7,
            max_tokens: 150
        });

        const fluxPrompt = promptEngineeringResponse.choices[0]?.message?.content?.trim() || `Moroccan interior with ${zellige.name} zellige, high quality`;
        console.log("Generated FLUX Prompt:", fluxPrompt);

        // 3. Call Replicate with FLUX-dev Image-to-Image
        // Following User's Tips: prompt_strength: 0.7, guidance_scale: 3.5, and negative_prompt
        const output: any = await replicate.run(
            "black-forest-labs/flux-dev",
            {
                input: {
                    image: originalImageUrl,
                    prompt: fluxPrompt,
                    guidance: 3.5, // Standard FLUX guidance
                    prompt_strength: 0.7, // Denoising strength for img2img
                    negative_prompt: "blurry, distorted tiles, wrong colors, different room, changed furniture, low quality",
                    num_outputs: 1,
                    num_inference_steps: 28,
                    output_format: "png",
                }
            }
        );

        const generatedImageUrl = Array.isArray(output) ? output[0] : output;
        
        if (!generatedImageUrl) {
            throw new Error('Replicate failed to return an image');
        }

        // 4. Restore Dimensions
        const genRes = await fetch(generatedImageUrl);
        const genBuffer = Buffer.from(await genRes.arrayBuffer());
        const restoredBuffer = await sharp(genBuffer)
            .resize(originalWidth, originalHeight, { fit: 'fill' })
            .png()
            .toBuffer();

        // 5. Upload to Supabase for persistence
        const fileName = `gen_${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
            .from('room-generated')
            .upload(fileName, restoredBuffer, { contentType: 'image/png' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('room-generated')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error('AI Error:', error);
        return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
    }
}
