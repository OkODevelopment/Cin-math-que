"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Movie {
    id: string;
    title: string;
    rating: number;
    comment?: string;
}

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState<Movie[]>([]);

    // Charger la wishlist depuis le serveur
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/wishlist");
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération de la wishlist.");
                }
                const data = await response.json();
                setWishlist(data);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };

        fetchWishlist();
    }, []);

    // Supprimer un film de la wishlist
    const handleDeleteFromWishlist = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/wishlist/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du film.");
            }

            setWishlist((prevWishlist) => prevWishlist.filter((movie) => movie.id !== id));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    return (
        <div className="p-8 bg-black min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold text-yellow-500">Ma Wishlist 🎥</h1>
                <p className="text-gray-400 mt-4">Voici les films que vous avez ajoutés à votre wishlist.</p>
            </header>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                >
                    Retour à l'accueil
                </button>
            </div>
            <main>
                {wishlist.length > 0 ? (
                    <div className="space-y-6">
                        {wishlist.map((movie) => (
                            <div
                                key={movie.id}
                                className="p-6 bg-[#333333] border border-[#555555] rounded-lg shadow-md"
                            >
                                <h3 className="text-2xl font-bold text-yellow-400">{movie.title}</h3>
                                <p className="text-yellow-300 text-lg">
                                    {"★".repeat(movie.rating) + "☆".repeat(5 - movie.rating)}
                                </p>
                                {movie.comment && (
                                    <p className="text-gray-300 italic mt-2">"{movie.comment}"</p>
                                )}
                                <button
                                    onClick={() => handleDeleteFromWishlist(movie.id)}
                                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center mt-10">Votre wishlist est vide.</p>
                )}
            </main>
        </div>
    );
}
