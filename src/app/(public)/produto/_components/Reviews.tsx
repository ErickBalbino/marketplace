import Image from "next/image";
import { RatingStars } from "./RatingStars";

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  photo?: string;
};

export function Reviews({ reviews }: { reviews: Review[] }) {
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="rounded-2xl border p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Avaliações</h2>
          <p className="mt-1 text-sm text-slate-600">
            {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
          </p>
        </div>
        <RatingStars value={avg} />
      </header>

      <ul className="grid gap-5">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.author}</div>
              <RatingStars value={r.rating} />
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Avaliado em {new Date(r.date).toLocaleDateString("pt-BR")}
            </div>
            <div className="mt-2 text-slate-800">
              <div className="font-medium">{r.title}</div>
              <p className="mt-1 leading-relaxed text-slate-700">{r.text}</p>
            </div>
            {r.photo && (
              <div className="mt-3 relative h-32 w-48 overflow-hidden rounded-lg border">
                <Image
                  src={r.photo}
                  alt=""
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
