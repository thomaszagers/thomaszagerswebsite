export function getHeaderOffset() {
  return window.innerWidth >= 768 ? 92 : 80
}

export function getHashFromTo(to: string) {
  if (to.startsWith("/#")) return to.slice(1)
  if (to.startsWith("#")) return to
  return null
}

export function scrollToHash(
  hash: string,
  behavior: ScrollBehavior = "smooth"
) {
  const normalizedHash = hash.startsWith("#") ? hash : `#${hash}`

  if (normalizedHash === "#home") {
    window.scrollTo({ top: 0, behavior })
    return
  }

  const targetId = normalizedHash.replace("#", "")
  const element = document.getElementById(targetId)

  if (!element) return

  const elementTop = element.getBoundingClientRect().top + window.scrollY
  const scrollTop = Math.max(elementTop - getHeaderOffset(), 0)

  window.scrollTo({
    top: scrollTop,
    behavior,
  })
}