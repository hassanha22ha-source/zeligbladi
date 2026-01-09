import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { originalImageUrl, zellige, targetArea, maskImageUrl } = body;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key missing on server' }, { status: 500 });
        }

        if (!originalImageUrl || !zellige) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Fetch original image
        const imageRes = await fetch(originalImageUrl);
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        const metadata = await sharp(imageBuffer).metadata();
        const originalWidth = metadata.width || 1024;
        const originalHeight = metadata.height || 1024;

        // 2. Build a hyper-realistic prompt based on User's Tips
        const zelligeName = zellige.name.toLowerCase();
        const zelligeDesc = (zellige.description || '').toLowerCase();
        const searchPool = `${zelligeName} ${zelligeDesc}`;

        const colorMap: Record<string, string> = {
            'blue': 'Authentic Fez Blue',
            'bleu': 'Authentic Fez Blue',
            'green': 'Emerald Green',
            'vert': 'Emerald Green',
            'red': 'Traditional Terra Cotta',
            'rouge': 'Traditional Terra Cotta',
            'white': 'Glossy Bone White',
            'blanc': 'Glossy Bone White',
            'black': 'Sleek Charcoal',
            'noir': 'Sleek Charcoal',
            'turquoise': 'Vibrant Turquoise',
            'turq': 'Vibrant Turquoise',
            'gold': 'Golden Honey',
            'miel': 'Golden Honey'
        };

        let colorFinal = "Traditional Moroccan";
        for (const [key, val] of Object.entries(colorMap)) {
            if (searchPool.includes(key)) {
                colorFinal = val;
                break;
            }
        }

        // Detailed Prompt using User's recommended keywords
        const prompt = `صورة واقعية جداً (Photorealistic) وعالية الدقة (High-Resolution) لغرفة داخلية مع بلاطات زليجية مغربية أصلية بلون ${colorFinal} مطبقة على الـ ${targetArea === 'wall' ? 'Wall' : 'Floor'}.
    Details: ${zellige.name}, authentic handmade ceramic texture, glossy reflective finish, subtle color variations.
    Keywords: Ultra-detailed, cinematic lighting (إضاءة سينمائية), 8k resolution, photorealistic architectural photography.
    MANDATORY PRESERVATION: 
    - KEEP original lighting, furniture, and room layout 100% UNCHANGED.
    - Matches the original photo's perspective perfectly.
    - NO TEXT, NO LOGOS, NO GRAPHICS (بلا نصوص أو علامات).`;

        // 3. Process Original Image
        const aiInputBuffer = await sharp(imageBuffer)
            .resize(1024, 1024, { fit: 'fill' })
            .ensureAlpha()
            .png()
            .toBuffer();

        // 4. Generate Adaptive Mask
        let finalMaskBuffer: Buffer;
        if (maskImageUrl) {
            const mRes = await fetch(maskImageUrl);
            finalMaskBuffer = await sharp(Buffer.from(await mRes.arrayBuffer()))
                .resize(1024, 1024, { fit: 'fill' })
                .ensureAlpha()
                .png()
                .toBuffer();
        } else {
            const maskBuf = Buffer.alloc(1024 * 1024 * 4, 255);

            if (targetArea === 'wall') {
                const sY = 100, eY = 900, sX = 100, eX = 924;
                for (let y = sY; y < eY; y++) {
                    for (let x = sX; x < eX; x++) {
                        const idx = (y * 1024 + x) * 4;
                        maskBuf[idx + 3] = 0;
                    }
                }
            } else {
                const startY = 384;
                for (let y = startY; y < 1024; y++) {
                    for (let x = 0; x < 1024; x++) {
                        const idx = (y * 1024 + x) * 4;
                        maskBuf[idx + 3] = 0;
                    }
                }
            }

            finalMaskBuffer = await sharp(maskBuf, {
                raw: { width: 1024, height: 1024, channels: 4 }
            })
                .png()
                .toBuffer();
        }

        // 5. OpenAI API Call
        const response = await openai.images.edit({
            image: new File([new Uint8Array(aiInputBuffer)], 'image.png', { type: 'image/png' }),
            mask: new File([new Uint8Array(finalMaskBuffer)], 'mask.png', { type: 'image/png' }),
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const generatedImageUrl = response.data?.[0]?.url;
        if (!generatedImageUrl) throw new Error('No image returned');

        // 6. Restore Dimensions
        const genRes = await fetch(generatedImageUrl);
        const genBuffer = Buffer.from(await genRes.arrayBuffer());
        const restoredBuffer = await sharp(genBuffer)
            .resize(originalWidth, originalHeight, { fit: 'fill' })
            .png()
            .toBuffer();

        // 7. Upload to Supabase
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
