"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { Review } from "@/types/review";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { reviews: Review[] };

type SortKey = "recent" | "oldest";
type Sentiment = "all" | "positive" | "negative";

function formatDateISOToBR(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

function BrlPercent(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function Reviews({ reviews }: Props) {
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

  const countsByStar = useMemo(() => {
    const map: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    for (const r of reviews) map[r.rating] += 1;
    return map;
  }, [reviews]);

  const recommendRatio =
    total > 0 ? reviews.filter((r) => r.recommend).length / total : 0;

  const [sort, setSort] = useState<SortKey>("recent");
  const [onlyWithImages, setOnlyWithImages] = useState<boolean>(false);
  const [sentiment, setSentiment] = useState<Sentiment>("all");
  const [visible, setVisible] = useState<number>(6);

  const filteredSorted = useMemo(() => {
    let list = [...reviews];

    if (sentiment === "positive") list = list.filter((r) => r.rating >= 4);
    if (sentiment === "negative") list = list.filter((r) => r.rating <= 2);

    if (onlyWithImages) list = list.filter((r) => !!r.photo);

    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "recent" ? db - da : da - db;
    });

    return list;
  }, [reviews, sort, onlyWithImages, sentiment]);

  const showing = filteredSorted.slice(0, visible);

  return (
    <section className="w-full flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-col lg:sticky lg:top-24 lg:self-start min-w-[280px] max-w-[400px] w-full">
        <div className="rounded-xl border p-4">
          <h2 className="text-xl font-semibold">Avaliações</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl font-bold leading-none">
              {avg.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <RatingStars value={avg} size={20} />
              <p className="mt-1 text-sm text-slate-600">
                {total} {total === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
              <div className="text-2xl font-bold">
                {BrlPercent(recommendRatio)}
              </div>
              <div className="text-xs">
                dos clientes <b>recomendam</b> este produto
              </div>
            </div>
            <div className="rounded-lg bg-rose-50 p-3 text-rose-700">
              <div className="text-2xl font-bold">
                {BrlPercent(1 - recommendRatio)}
              </div>
              <div className="text-xs">
                dos clientes <b>não recomendam</b>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4">
          <h3 className="font-semibold">Distribuição de notas</h3>
          <div className="mt-3">
            {(
              Object.keys(countsByStar) as unknown as Array<
                keyof typeof countsByStar
              >
            )
              .sort((a, b) => Number(b) - Number(a))
              .map((k) => {
                const count = countsByStar[k];
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div
                    key={k}
                    className="flex w-full items-center rounded-lg p-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="w-16 shrink-0 text-sm flex-1">
                      {k} estrelas
                    </span>
                    <div className="relative h-2 flex-3 rounded-full bg-slate-200">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-brand-700"
                        style={{ width: `${pct}%` }}
                        aria-hidden
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm text-slate-600">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="mb-4 flex flex-wrap justify-end items-center gap-2 px-4 lg:px-0">
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              className="accent-brand-800"
              checked={onlyWithImages}
              onChange={(e) => setOnlyWithImages(e.target.checked)}
            />
            Com imagens
          </label>

          <Select
            value={sentiment}
            onValueChange={(v: Sentiment) => {
              setSentiment(v);
              setVisible(6);
            }}
          >
            <SelectTrigger className="w-[170px] rounded-lg border-slate-300">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="positive">Positivas</SelectItem>
              <SelectItem value="negative">Negativas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(v: SortKey) => {
              setSort(v);
              setVisible(6);
            }}
          >
            <SelectTrigger className="w-[170px] rounded-lg border-slate-300">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredSorted.length === 0 ? (
          <p className="py-8 text-center text-slate-600">
            Nenhuma avaliação encontrada com os filtros selecionados.
          </p>
        ) : (
          <>
            <ul role="list" className="grid gap-5">
              {showing.map((r) => (
                <li key={r.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.author}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        Avaliado em {formatDateISOToBR(r.date)} ·{" "}
                        {r.recommend ? (
                          <span className="text-emerald-700">Recomenda</span>
                        ) : (
                          <span className="text-rose-700">Não recomenda</span>
                        )}
                      </div>
                    </div>
                    <RatingStars value={r.rating} />
                  </div>

                  <div className="mt-2 text-slate-800">
                    <div className="font-medium">{r.title}</div>
                    <p className="mt-1 leading-relaxed text-slate-700">
                      {r.text}
                    </p>
                  </div>

                  {r.photo && (
                    <div className="mt-3 relative h-36 w-56 overflow-hidden rounded-lg border">
                      <Image
                        src={r.photo}
                        alt={`Foto do cliente ${r.author}`}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {visible < filteredSorted.length && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + 10)}
                  className="flex items-center justify-center rounded-xl border px-4 py-3 text-sm hover:bg-brand-900 bg-brand-800 text-white cursor-pointer"
                >
                  Ver mais avaliações <ChevronDown size={18} className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
