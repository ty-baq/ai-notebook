import { db } from "@/lib/db"
import { $notes } from "@/lib/db/schema"
import { uploadFIleToFirebase } from "@/lib/firebase"
import { NextResponse } from "next/server"
import {eq} from 'drizzle-orm'


export async function POST(req: Request){
    try{
        const { noteId } = await req.json()

        const notes = await db.select().from($notes).where(
            eq($notes.id, parseInt(noteId))
        )

        if(!notes[0].imageUrl){
            return new NextResponse('no image url', {
                status: 400
            })
        }

        const firebase_url = await uploadFIleToFirebase(notes[0].imageUrl, notes[0].name)

        await db.update($notes)
                .set({
                    imageUrl: firebase_url
                })
                .where(eq($notes.id, parseInt(noteId)))

                return new NextResponse('true',
                    {
                        status: 200                    })

    }catch(err){
        return new NextResponse('err', {
            status: 500
        })
    }
}