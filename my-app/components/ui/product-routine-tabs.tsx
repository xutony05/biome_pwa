'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Product {
  name: string;
  image?: string;
  url?: string;
}

interface ProductRoutineTabsProps {
  products: {
    // Value tier products
    value_cleanser_name?: string;
    value_cleanser_url?: string;
    value_cleanser_image?: string;
    value_toner_name?: string;
    value_toner_url?: string;
    value_toner_image?: string;
    value_serum_name?: string;
    value_serum_url?: string;
    value_serum_image?: string;
    value_moisturizer_name?: string;
    value_moisturizer_url?: string;
    value_moisturizer_image?: string;
    value_sunscreen_name?: string;
    value_sunscreen_url?: string;
    value_sunscreen_image?: string;
    // Quality tier products
    quality_cleanser_name?: string;
    quality_cleanser_url?: string;
    quality_cleanser_image?: string;
    quality_toner_name?: string;
    quality_toner_url?: string;
    quality_toner_image?: string;
    quality_serum_name?: string;
    quality_serum_url?: string;
    quality_serum_image?: string;
    quality_moisturizer_name?: string;
    quality_moisturizer_url?: string;
    quality_moisturizer_image?: string;
    quality_sunscreen_name?: string;
    quality_sunscreen_url?: string;
    quality_sunscreen_image?: string;
    // Luxury tier products
    luxury_cleanser_name?: string;
    luxury_cleanser_url?: string;
    luxury_cleanser_image?: string;
    luxury_toner_name?: string;
    luxury_toner_url?: string;
    luxury_toner_image?: string;
    luxury_serum_name?: string;
    luxury_serum_url?: string;
    luxury_serum_image?: string;
    luxury_moisturizer_name?: string;
    luxury_moisturizer_url?: string;
    luxury_moisturizer_image?: string;
    luxury_sunscreen_name?: string;
    luxury_sunscreen_url?: string;
    luxury_sunscreen_image?: string;
  };
}

export function ProductRoutineTabs({ products }: ProductRoutineTabsProps) {
  const [activeTab, setActiveTab] = useState<'value' | 'quality' | 'luxury'>('value');

  const getProductsForRoutine = (routine: 'value' | 'quality' | 'luxury'): Product[] => {
    const productList: Product[] = [];
    
    // Define the product categories in the order they should appear
    const productCategories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];
    
    // Loop through each product category and create Product objects
    productCategories.forEach(category => {
      const product = {
        name: products[`${routine}_${category}_name` as keyof typeof products] as string,
        image: products[`${routine}_${category}_image` as keyof typeof products] as string,
        url: products[`${routine}_${category}_url` as keyof typeof products] as string,
        // Note: price and brand are not available in the new schema, so we omit them
      };
      
      // Only add products that have a name (indicating they exist)
      if (product.name && product.name.trim() !== '') {
        productList.push(product);
      }
    });
    
    return productList;
  };

  const tabs = [
    { id: 'value' as const, label: 'Value Routine' },
    { id: 'quality' as const, label: 'Quality Routine' },
    { id: 'luxury' as const, label: 'Luxury Routine' },
  ];

  const currentProducts = getProductsForRoutine(activeTab);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {currentProducts.map((product, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow h-full flex flex-col">
            {/* Product Image */}
            <div className="aspect-square mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow space-y-2">
              <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-3 min-h-[3.5rem]">
                {product.name}
              </h3>

              <div className="mt-auto">
                {product.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    asChild
                  >
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1"
                    >
                      View Product
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products available for this routine.
        </div>
      )}
    </div>
  );
}
