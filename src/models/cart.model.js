import mongoose, {Schema} from "mongoose";

const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name : {
        type : String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price : {
        type : Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    totalPrice : {
        type : Number,
        required : true,
        min : 0,
        default : 0,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

cartItemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Cart = mongoose.model('Cart', cartSchema);
