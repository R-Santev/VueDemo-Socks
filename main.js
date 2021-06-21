Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
            </p>
            <p>
                <input type="submit"  value="Submit">
            </p>
        </form>
    `,
    data() {
    return {
        name: '',
        review: '',
        rating: null
    }},
    methods: {
        onSubmit() {
            let newRevue = {
                name: this.name,
                review: this.review,
                rating: this.rating
            };

            this.$emit('review-submitted', newRevue);

            this.name = '';
            this.review = '';
            this.rating = null;
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="description">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>

                <p v-if="quantity > 10">In Stock</p>
                <p v-else-if="quantity <= 10 && quantity > 0">Almost sold out!</p>
                <p style="text-decoration: line-through;" v-else>Out of Stock</p>

                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <!-- <p v-show>Show or no</p> Put a css display property on the element, unlike if which remove the element from the DOM -->

                <div v-for="(variant, index) in variants"
                    :key="variant.id"
                    class="color-box"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover="updateProduct(index)">
                </div>
                <!-- : means v-bind -->
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
            </div>

            <div>
                <h2>Reviews</h2>
                <p v-if=" !reviews.length ">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">{{ review }}</li>
                </ul>
            </div>
            
            <product-review @review-submitted="addReview"/>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'Best socks ever!',
            index: 0,
            details: ['cotton 70%', 'polyester 30%', 'Gender-neutral'],
            variants: [{
                    id: 'fdsaFGRWGVR2',
                    color: 'Blue',
                    image: 'vmSocks-blue-onWhite.jpg',
                    quantity: 10
                },
                {
                    id: 'gdsg4rg53735HGA',
                    color: 'Green',
                    image: 'vmSocks-green-onWhite.jpg',
                    quantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart,
        updateProduct,
        addReview
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.index].image;
        },
        inStock() {
            return this.variants[this.index].quantity;
        },
        quantity() {
            return this.variants[this.index].quantity
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            } else {
                return 2.99;
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart
    }
});

function addToCart() {
    this.$emit('add-to-cart', this.variants[this.index].id);
}

function updateProduct(index) {
    this.index = index;
}

function updateCart(id) {
    this.cart.push(id);
}

function addReview(review) {
    this.reviews.push(review);
}
