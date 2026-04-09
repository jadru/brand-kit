export interface LandingFaqItem {
  id: string
  question: string
  answer: string
}

const landingFaqIds = ['1', '2', '3', '4', '5', '6'] as const

export function getLandingFaqItems(
  translate: (key: string) => string
): LandingFaqItem[] {
  return landingFaqIds.map((id) => ({
    id,
    question: translate(`faq.items.${id}.question`),
    answer: translate(`faq.items.${id}.answer`),
  }))
}
