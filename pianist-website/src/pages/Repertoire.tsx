import {useEffect, useMemo, useState} from 'react'
import PageHeader from '../components/PageHeader'
import {sanityClient} from '../lib/sanity'
import {repertoireItemsQuery} from '../lib/queries'
import type {RepertoireItemData} from '../lib/types'

function formatCategory(category?: string) {
  if (!category) return 'Other'
  return category
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function Repertoire() {
  const [items, setItems] = useState<RepertoireItemData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient
      .fetch<RepertoireItemData[]>(repertoireItemsQuery)
      .then((data) => setItems(data || []))
      .catch((error) => console.error('Failed to fetch repertoire items:', error))
      .finally(() => setLoading(false))
  }, [])

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, RepertoireItemData[]>>((acc, item) => {
      const category = formatCategory(item.category)
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {})
  }, [items])

  return (
    <section className="page-section">
      <div className="container-shell space-y-12 sm:space-y-16">
        <PageHeader
          kicker="Repertoire"
          title="Repertoire"
          description="Selected works, composers, and performance material."
        />

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading repertoire...</p>
        ) : items.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">
            No repertoire available at the moment.
          </p>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <section key={category} className="space-y-5">
                <h2 className="editorial-title text-4xl font-semibold sm:text-5xl">
                  {category}
                </h2>

                <div className="space-y-4">
                  {categoryItems.map((item) => (
                    <article
                      key={item._id}
                      className="soft-card rounded-[1.5rem] px-5 py-5 sm:px-6"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold sm:text-2xl">
                            {item.workTitle}
                          </h3>

                          {item.duration ? (
                            <span className="text-sm font-medium text-[var(--muted-foreground)]">
                              {item.duration}
                            </span>
                          ) : null}
                        </div>

                        <p className="text-[var(--accent)] font-medium">
                          {item.composer}
                        </p>

                        {item.notes ? (
                          <p className="text-[var(--muted-foreground)] leading-7">
                            {item.notes}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}