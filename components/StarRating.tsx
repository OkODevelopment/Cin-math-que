"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
}

export function StarRating({ rating, setRating }: StarRatingProps) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`cursor-pointer text-3xl transition-colors duration-300 ${
                        star <= (hover || rating) ? "text-red-600" : "text-gray-500"
                    }`}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)} // Met à jour la valeur dans le parent
                />
            ))}
        </div>
    );
}
