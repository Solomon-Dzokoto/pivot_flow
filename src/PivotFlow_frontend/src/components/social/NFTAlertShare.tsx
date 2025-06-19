import React from 'react';
import { Share2, Twitter, Link } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useNotificationStore } from '../../store/useNotificationStore';

interface NFTAlertShareProps {
  alertId: string;
  collectionName: string;
  collectionSlug: string;
  targetPrice: number;
  currency: string;
}

export const NFTAlertShare: React.FC<NFTAlertShareProps> = ({
  alertId,
  collectionName,
  collectionSlug,
  targetPrice,
  currency,
}) => {
  const { addNotification } = useNotificationStore((state) => state.actions);

  const alertText = `I'm tracking ${collectionName} on PivotFlow! Target price: ${targetPrice} ${currency}`;
  const alertUrl = `https://pivotflow.app/alerts/${collectionSlug}/${alertId}`;

  const shareToTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(alertText)}&url=${encodeURIComponent(alertUrl)}`;
    window.open(tweetUrl, '_blank');
    
    addNotification({
      type: 'system',
      title: 'Shared to Twitter',
      message: `You shared an alert for ${collectionName}`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${alertText}\n${alertUrl}`);
    
    addNotification({
      type: 'system',
      title: 'Link Copied',
      message: 'Alert details copied to clipboard',
    });
  };

  const shareAlert = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NFT Alert for ${collectionName}`,
          text: alertText,
          url: alertUrl,
        });
        
        addNotification({
          type: 'system',
          title: 'Alert Shared',
          message: `You shared an alert for ${collectionName}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2" />
          Share to Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        {typeof navigator.share === 'function' && (
          <DropdownMenuItem onClick={shareAlert} className="cursor-pointer">
            <Share2 className="h-4 w-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
