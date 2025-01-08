"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AddMovieForm } from "@/components/AddMovieForm";
import { MovieList } from "@/components/MovieList";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
    const router = useRouter();

    const [movies, setMovies] = useState<{ id: string; title: string; rating: number; comment?: string }[]>([]);
    const [filterRating, setFilterRating] = useState<number>(0); // Filtrage par note
    const [sortCriteria, setSortCriteria] = useState<"title" | "rating" | null>(null); // Critère de tri

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/movies");
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des films.");
                }
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };

        fetchMovies();
    }, []);

    const handleAddMovie = async (movie: { title: string; rating: number; comment?: string }) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du film.");
            }

            const newMovie = await response.json();
            setMovies((prevMovies) => [...prevMovies, newMovie]);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleDeleteMovie = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/movies/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du film.");
            }

            setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleUpdateMovie = async (
        id: string,
        updatedMovie: { title: string; rating: number; comment?: string }
    ) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/movies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedMovie),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la modification du film.");
            }

            const updatedData = await response.json();

            setMovies((prevMovies) =>
                prevMovies.map((movie) => (movie.id === id ? { ...movie, ...updatedData } : movie))
            );
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleAddToWishlist = async (movie: { id: string; title: string; rating: number; comment?: string }) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movie),
            });

            const data = await response.json();

            if (response.status === 200 && data.message === "Le film existe déjà dans la wishlist sans modification.") {
                alert("Ce film est déjà présent dans la wishlist sans modification.");
            } else if (response.status === 200 && data.message === "Le film a été mis à jour dans la wishlist.") {
                alert("Le film a été mis à jour dans la wishlist.");
            } else if (response.status === 201) {
                alert("Le film a été ajouté à la wishlist.");
            } else {
                throw new Error(data.error || "Erreur inconnue.");
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de l'ajout à la wishlist.");
        }
    };

    const filteredMovies = movies
        .filter((movie) => movie.rating >= filterRating)
        .sort((a, b) => {
            if (sortCriteria === "title") {
                return a.title.localeCompare(b.title); // Tri alphabétique
            }
            if (sortCriteria === "rating") {
                return b.rating - a.rating; // Tri par note
            }
            return 0; // Pas de tri
        });

    return (
        <div className="p-8 bg-black min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold text-red-600">Ma Cinémathèque 🎬</h1>
                <p className="text-gray-400 mt-4">Ajoutez, notez et organisez vos films préférés.</p>
            </header>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <label className="text-white mr-4">Trier par :</label>
                    <select
                        value={sortCriteria || ""}
                        onChange={(e) => setSortCriteria(e.target.value as "title" | "rating")}
                        className="p-2 bg-gray-800 text-white rounded"
                    >
                        <option value="">Aucun</option>
                        <option value="title">Titre</option>
                        <option value="rating">Note</option>
                    </select>
                </div>
                <button
                    onClick={() => router.push("/wishlist")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-800"
                >
                    Voir la wishlist
                </button>
            </div>
            <main>
                <AddMovieForm onAddMovie={handleAddMovie} />

                <div className="mt-10">
                    <label className="text-white font-medium">Afficher les films avec une note de :</label>
                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(Number(e.target.value))}
                        className="ml-4 p-2 bg-gray-800 text-white rounded"
                    >
                        <option value={0}>Toutes les notes</option>
                        <option value={4}>4 étoiles et plus</option>
                        <option value={5}>5 étoiles</option>
                    </select>
                </div>
                <p className="text-white mt-1">{filteredMovies.length} film(s) trouvé(s) avec ce filtre.</p>

                <AnimatePresence>
                    <MovieList
                        movies={filteredMovies}
                        onUpdateMovie={handleUpdateMovie}
                        onDeleteMovie={handleDeleteMovie}
                        onAddToWishlist={handleAddToWishlist}
                    />
                </AnimatePresence>
            </main>
        </div>
    );
}
