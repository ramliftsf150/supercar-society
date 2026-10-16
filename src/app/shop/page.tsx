import './shop.css';
import { ScrollTheme } from '@/components/scroll-theme';
import type { Metadata } from 'next';
import { Label, Photo, Button } from '@/components/ui';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shop SCS | Apparel',
  description: 'Discover Super Car Society apparel. Explore the real SCS shirt collection and lifestyle campaign. Store launching soon.',
};

export default function Shop() {
  return <ScrollTheme className="shop-page" start={0.30} end={0.65}>
    <section className="shop-hero">
      <div className="shop-hero-copy">
        <Label>Super Car Society / Apparel</Label>
        <h1>WEAR THE<br /><span className="outline-text">SOCIETY.</span></h1>
        <p>For the drive. For the meet.<br />For everything in between.</p>
        <a href="#collection" className="text-link">EXPLORE THE COLLECTION</a>
      </div>
      <Photo name="campaign-hero" alt="Model wearing a black SCS shirt with a clearly visible gold chest logo in a blue supercar" priority sizes="(max-width: 700px) 100vw, 50vw" />
    </section>
    <div className="shop-notice"><span className="status-dot" /> STORE LAUNCHING SOON <span>Apparel with the same passion as the machines.</span></div>
    <section className="collection section-shell" id="collection">
      <div className="section-heading">
        <div><Label>01 / SCS Apparel</Label><h2>THE SOCIETY.<br />ON YOUR SLEEVE.</h2></div>
        <p>Our identity. Your everyday.<br />Purchasing will open when the store launches.</p>
      </div>
      <div className="collection-grid">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
        <figure className="collection-editorial">
          <Photo name="campaign-flatlay" alt="Front of a black SCS collared shirt laid across the hood of a blue supercar" sizes="(max-width: 700px) 88vw, 41vw" />
          <figcaption>AN OBSESSION YOU CAN WEAR.</figcaption>
        </figure>
      </div>
    </section>
    <section className="campaign section-shell" aria-labelledby="campaign-heading">
      <div className="section-heading">
        <div><Label>02 / Beyond the driver’s seat</Label><h2 id="campaign-heading">BUILT FOR<br /><span className="gold">THE CULTURE.</span></h2></div>
        <p>A shared passion.<br />A recognizable identity.</p>
      </div>
      <div className="campaign-layout">
        <figure className="campaign-wide">
          <Photo name="campaign-group" alt="Four people wearing SCS shirts gathered around a blue supercar in the studio" sizes="(max-width: 700px) 88vw, 56vw" />
          <figcaption>ONE SOCIETY. EVERY PERSPECTIVE.</figcaption>
        </figure>
        <figure className="campaign-tall">
          <Photo name="campaign-portrait" alt="Model in a black SCS shirt and skirt standing beside an open blue supercar door" sizes="(max-width: 700px) 64vw, 28vw" />
        </figure>
        <figure className="campaign-close">
          <Photo name="campaign-detail" alt="Close view of the embroidered gold Super Car Society logo and black shirt collar" sizes="(max-width: 700px) 55vw, 25vw" />
          <figcaption>THE DETAILS SAY IT ALL.</figcaption>
        </figure>
        <div className="campaign-signoff"><p>Take the society with you.</p><Button href="/">EXPLORE THE SOCIETY</Button></div>
      </div>
    </section>
  </ScrollTheme>;
}
