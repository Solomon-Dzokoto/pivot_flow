import React, { useEffect } from 'react';
import { useAppContext, NFTItem } from '../../../contexts/AppContext'; // Assuming NFTItem is exported from AppContext
import { ExternalLink, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../LoadingSpinner';

interface NftCardProps {
  nft: NFTItem & { collectionSlug: string; blockchain: string; }; // Ensure NFTItem includes these for fetching
}

/**
 * @component NftCard
 * @description Displays an individual NFT with its image, name, token ID, and fetched floor price.
 * Fetches floor price on mount if not already available or loading.
 * @param {NftCardProps} props - Props containing the NFT item data.
 * @returns {React.ReactElement} The NFT card component.
 */
export const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const { nftFloorPrices, fetchNftFloorPrice } = useAppContext();

  const priceKey = `${nft.collectionSlug}_${nft.blockchain}`;
  const floorPriceData = nftFloorPrices[priceKey];

  useEffect(() => {
    // Fetch price if not available, not currently loading, and no error previously,
    // or if there was an error but we want to allow retrying (not implemented here, simple fetch once)
    if (!floorPriceData || (!floorPriceData.isLoading && floorPriceData.price === null && !floorPriceData.error)) {
      fetchNftFloorPrice(nft.collectionSlug, nft.blockchain);
    }
  }, [nft.collectionSlug, nft.blockchain, floorPriceData, fetchNftFloorPrice]);

  const getCurrencySymbol = (currency: string) => {
    // This could be expanded or moved to utils
    if (currency.toUpperCase() === 'ETH') return 'ETH';
    if (currency.toUpperCase() === 'SOL') return 'SOL';
    return currency; // Default to the provided currency string
  };

  return (
    <div className="bg-card border-border rounded-xl p-3 sm:p-4 hover:border-accent/50 transition-all duration-300 group flex flex-col h-full">
      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-secondary relative">
        <img
          src={nft.imageUrl || `https://placehold.co/300x300/1E293B/CBD5E1?text=${nft.collectionName}`}
          alt={`${nft.collectionName} ${nft.tokenId || ''}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => (e.currentTarget.src = `https://placehold.co/300x300/1E293B/CBD5E1?text=Error`)} // Fallback for broken images
        />
      </div>

      <div className="flex-grow flex flex-col justify-between space-y-2">
        <div>
          <h3 className="text-sm sm:text-md font-semibold text-foreground truncate" title={nft.collectionName}>{nft.collectionName}</h3>
          {nft.tokenId && <p className="text-xs text-muted-foreground truncate" title={nft.tokenId}>#{nft.tokenId}</p>}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground/80">Floor Price</p>
            {floorPriceData?.isLoading ? (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground animate-pulse">
                <LoadingSpinner size="xs" />
                <span>Loading...</span>
              </div>
            ) : floorPriceData?.price !== null && floorPriceData?.price !== undefined ? (
              <p className="text-sm font-bold text-accent">
                {/* Assuming price is in main currency unit. Add currency symbol based on blockchain or NFT data */}
                {floorPriceData.price.toFixed(2)} {getCurrencySymbol(nft.currency || (nft.blockchain === "Solana" ? "SOL" : "ETH"))}
              </p>
            ) : (
              <div className="flex items-center space-x-1 text-xs text-red-500" title={floorPriceData?.error || "Price not available"}>
                <AlertCircle size={12} />
                <span>N/A</span>
              </div>
            )}
          </div>
          {nft.marketplaceUrl && (
            <a
              href={nft.marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-accent rounded-md transition-all duration-300"
              title="View on Marketplace"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
