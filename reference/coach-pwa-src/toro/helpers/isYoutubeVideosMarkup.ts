import { CheerioAPI } from 'cheerio'

export default function isYoutubeVideosMarkup($: CheerioAPI): boolean {
  return !!$('.at-youtube-video')?.length
}
