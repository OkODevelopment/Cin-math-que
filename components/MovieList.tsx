import { useState } from "react";

interface Movie {
    id: string; // Ajout de l'ID unique
    title: string;
    rating: number;
    comment?: string;
}

interface MovieListProps {
    movies: Movie[];
    onUpdateMovie: (id: string, updatedMovie: Movie) => void;
    onDeleteMovie: (id: string) => void;
    onAddToWishlist: (movie: Movie) => void;
}

export function MovieList({ movies, onUpdateMovie, onDeleteMovie, onAddToWishlist }: MovieListProps) {
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editedMovie, setEditedMovie] = useState<Movie | null>(null);

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditedMovie({ ...movies[index] }); // Copie les données existantes
    };

    const handleSave = () => {
        if (editIndex !== null && editedMovie) {
            // Vérifie si les données sont valides avant de sauvegarder
            if (!editedMovie.title.trim()) {
                alert("Le titre du film ne peut pas être vide.");
                return;
            }

            onUpdateMovie(editedMovie.id, editedMovie); // Envoie les données mises à jour au parent
            setEditIndex(null);
            setEditedMovie(null);
        }
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditedMovie(null);
    };

    return (
        <div className="space-y-6 mt-10">
            {movies.map((movie, index) => (
                <div
                    key={movie.id}
                    className="p-6 bg-black border border-[#3D0000] rounded-lg shadow-md flex flex-col space-y-2"
                >
                    {editIndex === index ? (
                        <>
                            <input
                                type="text"
                                value={editedMovie?.title || ""}
                                onChange={(e) =>
                                    setEditedMovie({ ...editedMovie!, title: e.target.value })
                                }
                                className="p-2 bg-gray-800 text-white rounded"
                                placeholder="Titre du film"
                            />
                            <div className="flex items-center space-x-4">
                                <label className="text-white font-medium">Note :</label>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() =>
                                            setEditedMovie({ ...editedMovie!, rating: star })
                                        }
                                        className={`cursor-pointer text-2xl ${
                                            star <= (editedMovie?.rating || 0)
                                                ? "text-red-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <textarea
                                value={editedMovie?.comment || ""}
                                onChange={(e) =>
                                    setEditedMovie({ ...editedMovie!, comment: e.target.value })
                                }
                                className="p-2 bg-gray-800 text-white rounded"
                                placeholder="Commentaire"
                                rows={3}
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
                                >
                                    Annuler
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-red-500">{movie.title}</h3>
                            <p className="text-red-400 text-lg">
                                {"★".repeat(movie.rating) + "☆".repeat(5 - movie.rating)}
                            </p>
                            {movie.comment && (
                                <p className="text-gray-300 italic mt-2">"{movie.comment}"</p>
                            )}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => onDeleteMovie(movie.id)} // Passe l'ID unique
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                                >
                                    Supprimer
                                </button>
                                <button
                                    onClick={() => onAddToWishlist(movie)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-800"
                                >
                                    Ajouter à la wishlist
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
