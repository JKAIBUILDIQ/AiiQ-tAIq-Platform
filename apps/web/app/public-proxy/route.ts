import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { promises as fs } from 'node:fs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function contentTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const relative = url.searchParams.get('path')
    if (!relative) return new NextResponse('Bad Request', { status: 400 })

    const baseDir = path.resolve(process.cwd(), '..', '..', 'Public')
    const safePath = path
      .normalize('/' + relative)
      .replace(/^[\/\\]+/, '')
      .replace(/\.\.+/g, '')
    const filePath = path.resolve(baseDir, safePath)

    const normBase = baseDir.replace(/\\/g, '/').toLowerCase()
    const normFile = filePath.replace(/\\/g, '/').toLowerCase()
    if (!normFile.startsWith(normBase)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const data = await fs.readFile(filePath)
    const ct = contentTypeFromExt(path.extname(filePath))
    return new NextResponse(data, { status: 200, headers: { 'Content-Type': ct, 'Cache-Control': 'no-store' } })
  } catch (e) {
    return new NextResponse('Not Found', { status: 404 })
  }
}


