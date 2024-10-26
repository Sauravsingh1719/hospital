import mongoose from "mongoose";

export interface Review extends Document {
    doctorId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema = new mongoose.Schema<Review>({
    doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model<Review>("Review", ReviewSchema);
export default Review;
