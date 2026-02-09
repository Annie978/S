import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

export const Footer = props => {
const d = new Date()
const currentYear = d.getFullYear()
const since = siteConfig('SINCE')
const copyrightDate =
parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

return (
<footer className='z-10 relative w-full bg-white px-6 border-t dark:border-hexo-black-gray dark:bg-hexo-black-gray '>
<DarkModeButton className='text-center pt-4' />

```
  <div className='container mx-auto max-w-4xl py-6 md:flex flex-wrap md:flex-no-wrap md:justify-between items-center text-sm'>
    {/* 👇 简洁图标+数字 */}
    <div className='text-center mb-3 md:mb-0 text-xs text-gray-500 dark:text-gray-400'>
      <span className="busuanzi_container_site_pv">
        👁️‍🗨️<span className="busuanzi_value_site_pv">0</span>
      </span>
      &nbsp;&nbsp;
      <span className="busuanzi_container_site_uv">
        🖤<span className="busuanzi_value_site_uv">0</span>
      </span>
      <script async src="<https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js>"></script>
    </div>

    <div className='text-center'>
      &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights
      reserved.
    </div>
    <div className='md:p-0 text-center md:text-right text-xs'>
      {siteConfig('BEI_AN') && (
        <a
          href={siteConfig('BEI_AN_LINK')}
          className='text-black dark:text-gray-200 no-underline hover:underline ml-4'>
          {siteConfig('BEI_AN')}
        </a>
      )}
      <BeiAnGongAn />
      <span className='dark:text-gray-200 no-underline ml-4'>
        Powered by
        <a
          href='<https://www.google.com>'
          className=' hover:underline'>
          NotionNext {siteConfig('VERSION')}
        </a>
      </span>
    </div>
  </div>
</footer>
```

)
}
