import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/db/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { NotionRenderer } from 'react-notion-x'

const NotionPage = ({ post, className }) => {
const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')
const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)

const notionArticleRef = useRef(null)

// 页面首次加载：注入全局CSS（解决放大镜光标+滚轮问题）
useEffect(() => {
if (!isBrowser) return

```
// 核心修复1：全局注入高优先级CSS，彻底去掉放大镜光标+恢复滚轮行为
const style = document.createElement('style')
style.id = 'disable-image-zoom-style'
style.textContent = `
  /* 彻底去掉所有图片的放大镜光标，优先级最高 */
  img, .notion-image img, .notion-collection-card-cover img {
    cursor: default !important; /* 强制默认光标，覆盖所有第三方样式 */
    touch-action: auto !important; /* 恢复移动端触摸滚动 */
    pointer-events: auto !important; /* 恢复鼠标事件正常响应 */
  }
  /* 禁用react-notion-x自带的放大相关样式 */
  [data-action="zoom"], .cursor-zoom-in, .notion-image {
    cursor: default !important;
    pointer-events: auto !important;
  }
  /* 确保页面滚轮在图片上也能滚动 */
  img {
    overflow-anchor: auto !important;
  }
`
// 先移除旧样式（防止重复注入），再添加新样式
const oldStyle = document.getElementById('disable-image-zoom-style')
if (oldStyle) oldStyle.remove()
document.head.appendChild(style)

autoScrollToHash()

// 组件卸载时移除样式
return () => {
  const styleToRemove = document.getElementById('disable-image-zoom-style')
  if (styleToRemove) styleToRemove.remove()
}
```

}, [])

useEffect(() => {
if (POST_DISABLE_GALLERY_CLICK) {
processGalleryImg()
}

```
if (POST_DISABLE_DATABASE_CLICK) {
  processDisableDatabaseUrl()
}

processAllImages()

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes.length) {
      processAllImages()
    }
  }
})

if (isBrowser && notionArticleRef.current) {
  observer.observe(notionArticleRef.current, {
    childList: true,
    subtree: true
  })
}

return () => observer.disconnect()
```

}, [post])

useEffect(() => {
if (SPOILER_TEXT_TAG) {
import('lodash/escapeRegExp').then(escapeRegExp => {
Promise.all([
loadExternalResource('/js/spoilerText.js', 'js'),
loadExternalResource('/css/spoiler-text.css', 'css')
]).then(() => {
window.textToSpoiler &&
window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
})
})
}

```
const timer = setTimeout(() => {
  const elements = document.querySelectorAll('.notion-collection-page-properties')
  elements?.forEach(element => {
    element?.remove()
  })
}, 1000)

return () => clearTimeout(timer)
```

}, [post])

// 核心修复2：调整图片处理逻辑，只禁用放大，不阻止页面滚轮
const processAllImages = () => {
if (!isBrowser || !notionArticleRef.current) return

```
const allImgs = notionArticleRef.current.querySelectorAll('img')
if (!allImgs.length) return

allImgs.forEach(img => {
  // 1. 强制去掉放大镜光标（双重保险）
  img.style.cursor = 'default !important'
  // 2. 禁用左键点击放大
  img.onclick = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  // 3. 禁用双击放大
  img.ondblclick = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  // 核心修复：移除onwheel阻止默认行为（恢复页面滚轮）
  // 原错误：img.onwheel = (e) => { e.preventDefault(); e.stopPropagation() }
  // 改为：只禁止图片缩放的特定逻辑，不阻止页面滚动
  img.onwheel = null // 清空之前的滚轮事件绑定
  // 4. 移除放大相关属性
  img.removeAttribute('data-action')
  img.removeAttribute('data-src')
  img.style.transform = 'none !important'
})
```

}

// 修复gallery图片的滚轮问题
const processGalleryImg = () => {
setTimeout(() => {
if (isBrowser) {
const imgList = document?.querySelectorAll('.notion-collection-card-cover img')
if (imgList) {
for (let i = 0; i < imgList.length; i++) {
imgList[i].style.cursor = 'default !important'
imgList[i].onclick = e => e.preventDefault()
imgList[i].onwheel = null // 清空滚轮阻止，恢复页面滚动
}
}

```
    const cards = document.getElementsByClassName('notion-collection-card')
    for (const e of cards) {
      e.removeAttribute('href')
    }
  }
}, 800)
```

}

const autoScrollToHash = () => {
setTimeout(() => {
const hash = window?.location?.hash
if (hash && hash.length > 0) {
const tocNode = document.getElementById(hash.substring(1))
if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
}
}
}, 180)
}

const mapPageUrl = id => '/' + id.replace(/-/g, '')

// 动态加载组件
const Code = dynamic(
() => import('react-notion-x/build/third-party/code').then(m => m.Code),
{ ssr: false }
)

const Equation = dynamic(
() => import('@/components/Equation').then(async m => {
await import('@/lib/plugins/mhchem')
return m.Equation
}),
{ ssr: false }
)

const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), { ssr: false })
const PrismMac = dynamic(() => import('@/components/PrismMac'), { ssr: false })

const TweetEmbed = dynamic(() => import('react-tweet-embed'), { ssr: false })

const AdEmbed = dynamic(
() => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
{ ssr: true }
)

const Collection = dynamic(
() => import('react-notion-x/build/third-party/collection').then(m => m.Collection),
{ ssr: true }
)

// 彻底移除Modal组件（图片放大核心）
const Tweet = ({ id }) => <TweetEmbed tweetId={id} />

return (
<div id='notion-article' ref={notionArticleRef} className={`mx-auto overflow-hidden ${className || ''}`}>
<NotionRenderer
recordMap={post?.blockMap}
mapPageUrl={mapPageUrl}
mapImageUrl={mapImgUrl}
components={{
Code,
Collection,
Equation,
Pdf,
Tweet
}}
/>

```
  <AdEmbed />
  <PrismMac />
</div>
```

)
}

const processDisableDatabaseUrl = () => {
if (isBrowser) {
const links = document.querySelectorAll('.notion-table a')
for (const e of links) {
e.removeAttribute('href')
}
}
}

export default NotionPage
