import React from "react";

const Products = () => {

    const products = [
        {
          id: 1,
          title: "Mountain Explorer Backpack",
          description: "Durable 50L backpack with waterproof coating, perfect for hiking and outdoor adventures.",
          tags: ["#hiking", "#outdoor", "#travel"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "123"
        },
        {
          id: 2,
          title: "Wireless Noise-Canceling Headphones",
          description: "Premium sound quality with 30-hour battery life and comfortable over-ear design.",
          tags: ["#audio", "#tech", "#music"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "1234"
        
        },
        {
          id: 3,
          title: "Stainless Steel Water Bottle",
          description: "Insulated 1L bottle keeps drinks cold for 24 hours or hot for 12 hours.",
          tags: ["#eco", "#fitness", "#hydration"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "123"
        },
        {
          id: 4,
          title: "Organic Cotton T-Shirt",
          description: "Soft, breathable t-shirt made from 100% organic cotton with minimalist design.",
          tags: ["#fashion", "#sustainable", "#casual"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "12345"
        },
        {
          id: 5,
          title: "Smart Fitness Watch",
          description: "Track your heart rate, steps, sleep patterns, and receive smartphone notifications.",
          tags: ["#fitness", "#tech", "#health"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "123"
        },
        {
          id: 6,
          title: "Handmade Ceramic Mug",
          description: "Artisan-crafted mug with unique glaze patterns, microwave and dishwasher safe.",
          tags: ["#home", "#artisan", "#coffee"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "1234"
        },
        {
          id: 7,
          title: "Compact Bluetooth Speaker",
          description: "Portable speaker with 15W output, waterproof design, and 10-hour playtime.",
          tags: ["#audio", "#portable", "#outdoor"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "123"
        },
        {
          id: 8,
          title: "Leather Notebook Cover",
          description: "Genuine leather cover with refillable notebook insert and pen holder.",
          tags: ["#stationery", "#office", "#gift"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "1234"
        },
        {
          id: 9,
          title: "Yoga Mat with Carry Strap",
          description: "Non-slip, eco-friendly mat with 5mm thickness for maximum comfort.",
          tags: ["#fitness", "#yoga", "#wellness"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "12345"
        },
        {
          id: 10,
          title: "Reusable Silicone Food Bags",
          description: "Set of 5 leak-proof bags for food storage, freezer-safe and dishwasher safe.",
          tags: ["#kitchen", "#eco", "#storage"],
          image: "./images/card-top.jpg",
          price: '10',
          category: "1234"
        }
      ];

  return (
    <div className="bg-slate-700 flex flex-col m-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
            <div key={product.id} className="rounded overflow-hidden shadow-lg border-white border-2 shadow-white hover:shadow-xl hover:shadow-blue-500/50 transition-shadow duration-300">
                <img 
                className="w-full h-48 object-cover" 
                src={product.image} 
                alt={product.title || ""} 
                />
                <div className="px-6 pt-4">
                    <div className="font-bold text-xl mb-2 text-white">
                        {product.title}
                    </div>
                    <p className="text-gray-100 text-base">
                        {product.description}
                    </p>
                    <div className="flex flex-row justify-between md:gap-4 lg:justify-between font-bold text-base mt-2">
                        <div className="py-1 px-2 w-fit bg-gray-100 rounded-b-md text-gray-700">
                            Category: {product.category}
                        </div>
                        <div className="py-1 px-2 w-fit bg-gray-100 rounded-b-md text-gray-700">
                            Price: ${product.price}
                        </div>
                    </div>
                      
                    <div className="px-6 pt-4 pb-2">
                        {product.tags.map((tag, index) => (
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {tag}
                          </span>
                        ))}
                    </div>
                    {/* Add to cart option */}
                    <div className="px-6 pt-4 pb-2 text-center">
                        <button 
                        type="button"
                        className="bg-blue-600 font-medium rounded-lg p-2 hover:cursor-pointer hover:bg-blue-400 hover:text-black"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        ))};
      </div>
    </div>
  );
};

export default Products;
