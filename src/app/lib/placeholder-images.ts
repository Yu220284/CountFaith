
export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = [
  {
    "id": "logo",
    "description": "PRA.net Logo",
    "imageUrl": "https://picsum.photos/seed/pra-logo/100/100",
    "imageHint": "planet logo"
  },
  {
    "id": "hero",
    "description": "Exploration and Discovery",
    "imageUrl": "https://picsum.photos/seed/pra1/1200/600",
    "imageHint": "landscape discovery"
  },
  {
    "id": "rally-tokyo",
    "description": "Tokyo Mystery Tour",
    "imageUrl": "https://picsum.photos/seed/pra2/600/400",
    "imageHint": "tokyo street"
  },
  {
    "id": "rally-food",
    "description": "Local Gourmet Rally",
    "imageUrl": "https://picsum.photos/seed/pra3/600/400",
    "imageHint": "japanese food"
  },
  {
    "id": "rally-history",
    "description": "Historical Landmarks",
    "imageUrl": "https://picsum.photos/seed/pra4/600/400",
    "imageHint": "ancient castle"
  }
];
