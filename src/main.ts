import fs from 'fs/promises'
import path from 'path'
import { Dirent } from 'fs'
import { ExifData, ExifImage } from 'exif/index'
import { AFormatDate } from './utils'
import { utimes } from 'utimes'

const dirRoot = path.join(__dirname, '..')
const dirImages = path.join(dirRoot, '_inp')
const dirImagesOut = path.join(dirRoot, '_out')

export function extractDateFromString(dateStr: string) {
  const YYYY = Number(dateStr.substring(0, 4))
  const MM = Number(dateStr.substring(4, 6))
  const DD = Number(dateStr.substring(6, 8))
  const output = new Date()
  output.setFullYear(YYYY, MM, DD)
  return output
}

export async function loadImage(pathImage: string) {
  return new Promise<ExifData>((resolve, reject) => {
    new ExifImage().loadImage(pathImage, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

export async function main() {
  console.log('main...')
  const files: Dirent[] = await fs.readdir(dirImages, {
    encoding: 'utf-8',
    withFileTypes: true,
    recursive: true,
  })

  const images = files.filter(f => f.isFile() && f.name.startsWith('IMG-'))
  
  for (let image of images) {
    const src = image.name
    let pathImage = path.join(dirImages, src)
    let pathImageOut = path.join(dirImagesOut, src)
    
    let dateStr = src.split('-')[1]
    let correctedDate = extractDateFromString(dateStr)

    const stats = await fs.lstat(pathImage)
    
    // const img = await loadImage(pathImage)
    // fs.utimes(pathImage)
    console.log(`> ${pathImage}`)
    console.log(`>   ${pathImageOut}`)
    console.log('> ', AFormatDate(stats.mtime) + ' => ' + AFormatDate(correctedDate))
    await fs.copyFile(pathImage, pathImageOut)
    // await fs.utimes(pathImageOut, stats.atime, correctedDate)
    await utimes(pathImageOut, {
      btime: correctedDate,
      mtime: correctedDate
    })
  }
  // files
  // console.log('files', files.slice(0, 10))
}


