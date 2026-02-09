import { useGlobal } from '@/lib/global'
// 移除了无用的日期格式化工具导入（因为不再处理时间）
import SmartLink from '@/components/SmartLink'

export const ArticleInfo = props => {
const { post } = props
const { locale } = useGlobal()

return (
<section className='w-full mx-auto mb-4'>
{/* 保留文章标题，完全不变 */}
<h2 className='text-5xl font-semibold py-10 dark:text-white text-center'>{post?.title}</h2>

```
  <div className='flex gap-3 font-semibold text-sm items-center justify-center'>
    {/* 👇 完全删除了发布时间相关的SmartLink代码块 */}

    {/* 保留分类展示逻辑，完全不变 */}
    {post?.type !== 'Page' && (
      <>
        <SmartLink href={`/category/${post?.category}`} passHref className='cursor-pointer text-md mr-2 text-green-500'>
          {post?.category}
        </SmartLink>
      </>
    )}

    {/* 保留标签展示逻辑，完全不变 */}
    <div className='flex py-1 space-x-3'>
      {post?.tags?.length > 0 && (
        <>
          {locale.COMMON.TAGS} <span>:</span>
        </>
      )}
      {post?.tags?.map(tag => {
        return (
          <SmartLink href={`/tag/${tag}`} key={tag} className='text-yellow-500 mr-2'>
            {tag}
          </SmartLink>
        )
      })}
    </div>
  </div>
</section>
```

)
}
