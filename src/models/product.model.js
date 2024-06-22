import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    image : {
        type : String,
        required: true,
    },
    rating : {
        type: Number,
        min : 0,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Product = mongoose.model('Product', productSchema);
