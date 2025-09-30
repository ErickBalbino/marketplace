"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "../AuthModal";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useIsMounted } from "@/hooks/useIsMounted";

interface FavoriteButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showToast?: boolean;
}

export function FavoriteButton({
  product,
  size = "md",
  className = "",
  showToast = true,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated, isLoading } = useAuth();

  const mounted = useIsMounted();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 28,
  };

  const isFav = isFavorite(product.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsAnimating(true);

    try {
      toggleFavorite(product);

      if (showToast) {
        if (!isFav) {
          toast.success("Produto adicionado aos favoritos!", {
            position: "top-right",
            duration: 2000,
          });
        } else {
          toast.info("Produto removido dos favoritos", {
            position: "top-right",
            duration: 2000,
          });
        }
      }
    } catch {
      toast.error("Erro ao atualizar favoritos");
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Favoritos"
        className="group relative inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/80 text-gray-400"
        disabled
      />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`
          group relative inline-flex items-center justify-center rounded-full 
          transition-all duration-300 ease-out
          hover:scale-110 active:scale-95 cursor-pointer
          ${sizeClasses[size]}
          ${
            isFav
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white/80 text-gray-400 hover:bg-white hover:text-gray-600"
          }
          ${isAnimating ? "scale-110" : ""}
          ${className}
        `}
        aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        disabled={isLoading}
      >
        {isAnimating && !isFav && (
          <div className="absolute inset-0 rounded-full bg-red-200 animate-ping" />
        )}

        <Heart
          size={iconSizes[size]}
          className={`
            transition-all duration-300
            ${
              isFav
                ? "fill-current scale-100"
                : "scale-90 group-hover:scale-100"
            }
            ${isAnimating && !isFav ? "scale-103" : ""}
          `}
          color="#f00"
        />

        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-red-200 transition-colors duration-300" />
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="favorite"
      />
    </>
  );
}
