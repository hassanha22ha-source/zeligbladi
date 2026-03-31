import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { replicate } from '@/lib/replicate';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { base64Image, originalImageUrl, product, surface } = body;

        if (!base64Image || !product) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Enhanced Prompt Engineering (TOTAL SURFACE REPLACEMENT)
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a technical architectural renderer. Your mission is to generate a prompt for a total surface replacement.

CRITICAL INSTRUCTIONS:
1. TOTAL COVERAGE: The target area (${surface === 'mur' ? 'all walls' : 'entire floors'}) must be COMPLETELY and UNIFORMLY covered by the tiles from wall to wall.
2. NO GAPS: None of the original floor or wall texture should be visible.
3. NO PATTERNS/BORDERS: Do NOT add borders, decorative patterns, flowers, or ornaments. The tiles must be SOLID UNIFORM color in a simple square grid.
4. PRODUCT: ${product.name}, colors ${product.color_palette}.
5. GEOMETRY: Small square handcrafted tiles in a tight 10x10cm grid layout.
6. PRESERVE ROOM: Keep the furniture, lighting, and exact floorplan of the owner's photo.

Output ONLY the prompt in English. Example: 'Complete wall-to-wall replacement of the floor in this photo with solid uniform red 10x10cm zelij tiles, no original floor visible, perfect grid, maintaining shadows and layout.'`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Generate a prompt that FORCES the AI to cover the WHOLE floor with red tiles, no patterns."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ],
                },
            ],
            max_tokens: 150,
            temperature: 0
        });

        const fluxPrompt = gptResponse.choices[0]?.message?.content?.trim() || "";
        console.log("Forced Coverage Prompt:", fluxPrompt);

        // 2. Call Replicate with HIGH ADHERENCE (Guidance 5.0)
        const output: any = await replicate.run(
           "black-forest-labs/flux-dev",
            {
                input: {
                    image: originalImageUrl,
                    prompt: fluxPrompt,
                    guidance: 5.0, // Forced adherence to the "Total Coverage" order
                    prompt_strength: 0.75, // Strong enough to replace, not enough to change room
                    negative_prompt: "decorative patterns, borders, flowers, motifs, rugs, different room, new furniture, blurry, low resolution, white gaps, original floor visible",
                    num_outputs: 1,
                    num_inference_steps: 35,
                    output_format: "png",
                    image_reference: product.product_images?.[0]?.image_url || product.image_url
                }
            }
        );

        const generatedImageUrl = Array.isArray(output) ? output[0] : output;
        if (!generatedImageUrl) throw new Error("Replicate failed to return an image");

        // 3. Process Result
        const imageRes = await fetch(originalImageUrl);
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        const metadata = await sharp(imageBuffer).metadata();
        const originalWidth = metadata.width || 1024;
        const originalHeight = metadata.height || 1024;

        const genRes = await fetch(generatedImageUrl);
        const genBuffer = Buffer.from(await genRes.arrayBuffer());
        const restoredBuffer = await sharp(genBuffer)
            .resize(originalWidth, originalHeight, { fit: 'fill' })
            .png()
            .toBuffer();

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
        console.error('GPT-4o/FLUX Error:', error);
        return NextResponse.json({ error: error.message || 'Error processing image' }, { status: 500 });
    }
}
