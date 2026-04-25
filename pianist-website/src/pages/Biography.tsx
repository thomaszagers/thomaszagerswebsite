import {useEffect, useState} from 'react'
import PageHeader from '../components/PageHeader'
import {sanityClient} from '../lib/sanity'
import {biographyQuery} from '../lib/queries'
import type {BiographyData} from '../lib/types'

function renderPortableText(
  blocks?: { _type: 'block'; children?: {text?: string}[] }[]
) {
  if (!blocks) return null

  return blocks.map((block, index) => {
    const text = block.children?.map((child) => child.text).join('') || ''
    return (
      <p
        key={index}
        className="text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl sm:leading-9"
      >
        {text}
      </p>
    )
  })
}

export default function Biography() {
  const [biography, setBiography] = useState<BiographyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<BiographyData>(biographyQuery)
      .then((data) => setBiography(data))
      .catch((error) => console.error('Failed to fetch biography:', error))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-section">
      <div className="container-shell space-y-10">
        <PageHeader
          kicker="Biography"
          title="Biography"
          description={biography?.shortBio}
        />

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading biography...</p>
        ) : (
          <div className="max-w-4xl space-y-6">
            {renderPortableText(biography?.fullBio)}
          </div>
        )}
      </div>
    </section>
  )
}