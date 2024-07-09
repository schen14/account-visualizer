export default function getFormattedAmount(balance: number): string {
  return balance.toLocaleString('en-US', {
    'style': 'currency',
    'currency': 'USD'
  })
}