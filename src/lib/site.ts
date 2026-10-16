export const site = {
  name: 'Super Car Society',
  // TODO: Add a company-verified address and social URLs before launch.
  email: null as string | null,
  socials: [] as { label: string; href: string }[],
};
export type Product = { id: string; name: string; image: string; alt: string; description?: string; price?: string; sizes?: string[]; purchaseUrl?: string };
// Editorial labels only. Replace with approved catalog data and checkout URLs.
export const products: Product[] = [{ id: 'scs-shirt', name: 'Super Car Society shirt', image: 'campaign-shirt', alt: 'Model showing the front and gold chest logo of a black collared Super Car Society shirt' }];
export const services = ['Vehicle Display', 'Promotional Appearance', 'Business Collaboration', 'Sponsored Event', 'Social Media Promotion', 'Custom Activation', 'Other'];
