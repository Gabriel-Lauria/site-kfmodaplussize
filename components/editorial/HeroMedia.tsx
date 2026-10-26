import Image from "next/image";
import { MirrorFrame } from "../MirrorFrame";

// Fotos do hero com parallax suave ao rolar, em CSS (animation-timeline): sem JavaScript.
// Navegadores sem esse recurso (Safari) mostram as fotos paradas.
export function HeroMedia({ image, imageSecondary, alt }: { image: string; imageSecondary?: string; alt: string }) {
  return (
    <div className="relative order-1 h-[min(118vw,520px)] lg:order-2 lg:h-auto lg:min-h-[700px]">
      <div className="absolute inset-x-5 bottom-0 top-5 sm:inset-x-16 sm:top-8 lg:left-10 lg:right-10 lg:top-10">
        <MirrorFrame className="h-full w-full">
          <div className="parallax-down absolute -inset-y-[8%] inset-x-0">
            <Image src={image} alt={alt} fill priority fetchPriority="high" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[50%_25%]" />
          </div>
        </MirrorFrame>
      </div>
      {imageSecondary && (
        <div className="parallax-up absolute bottom-10 left-2 z-10 hidden h-56 w-40 overflow-hidden border-[6px] border-paper shadow-2xl sm:block lg:-left-8">
          <Image src={imageSecondary} alt="" fill sizes="160px" className="object-cover" />
        </div>
      )}
    </div>
  );
}
