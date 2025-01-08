"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/StarRating";

interface AddMovieFormProps {
    onAddMovie: (movie: { title: string; rating: number; comment?: string }) => void;
}

function generateHexId() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function AddMovieForm({ onAddMovie }: AddMovieFormProps) {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0); // Initialisé à 0
    const [comment, setComment] = useState("");

    const handleAddMovie = () => {
        if (title.trim() === "") {
            alert("Le titre est obligatoire !");
            return;
        }

        if (rating === 0) {
            alert("Veuillez sélectionner une note !");
            return;
        }

        const newMovie = {
            id: generateHexId(), // Ajout de l'ID unique
            title,
            rating,
            comment: comment.trim() || undefined,
        };

        onAddMovie(newMovie);

        // Réinitialisation des champs
        setTitle("");
        setRating(0);
        setComment("");
    };

    return (
        <div className="p-6 bg-[#3D0000] border border-[#3D0000] rounded-lg shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Ajouter un Film</h2>
            <Input
                placeholder="Titre du film"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#3D0000] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            />
            <div className="flex items-center space-x-4">
                <label className="text-white font-medium">Note :</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <textarea
                placeholder="Ajoutez un commentaire (optionnel)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#3D0000] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2"
                rows={3}
            />
            <Button
                onClick={handleAddMovie}
                className="w-full bg-[#950101] hover:bg-red-600 text-white py-3 rounded-lg transition-transform transform hover:scale-105"
            >
                Ajouter
            </Button>
        </div>
    );
}

