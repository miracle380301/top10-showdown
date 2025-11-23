interface TierBadgeProps {
  tier: 'gold' | 'silver';
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const tierStyles = {
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    silver: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  const tierLabels = {
    gold: 'Gold',
    silver: 'Silver',
  };

  const tierEmojis = {
    gold: '🥇',
    silver: '🥈',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded border ${tierStyles[tier]}`}>
      {tierEmojis[tier]} {tierLabels[tier]}
    </span>
  );
}
