'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Product {
  name: string;
  price: number;
  image?: string;
  url?: string;
  brand?: string;
}

interface ProductRoutineTabsProps {
  products: {
    value_1_name?: string;
    value_1_price?: number;
    value_1_image?: string;
    value_1_url?: string;
    value_1_brand?: string;
    value_2_name?: string;
    value_2_price?: number;
    value_2_image?: string;
    value_2_url?: string;
    value_2_brand?: string;
    value_3_name?: string;
    value_3_price?: number;
    value_3_image?: string;
    value_3_url?: string;
    value_3_brand?: string;
    quality_1_name?: string;
    quality_1_price?: number;
    quality_1_image?: string;
    quality_1_url?: string;
    quality_1_brand?: string;
    quality_2_name?: string;
    quality_2_price?: number;
    quality_2_image?: string;
    quality_2_url?: string;
    quality_2_brand?: string;
    quality_3_name?: string;
    quality_3_price?: number;
    quality_3_image?: string;
    quality_3_url?: string;
    quality_3_brand?: string;
    luxury_1_name?: string;
    luxury_1_price?: number;
    luxury_1_image?: string;
    luxury_1_url?: string;
    luxury_1_brand?: string;
    luxury_2_name?: string;
    luxury_2_price?: number;
    luxury_2_image?: string;
    luxury_2_url?: string;
    luxury_2_brand?: string;
    luxury_3_name?: string;
    luxury_3_price?: number;
    luxury_3_image?: string;
    luxury_3_url?: string;
    luxury_3_brand?: string;
  };
}

export function ProductRoutineTabs({ products }: ProductRoutineTabsProps) {
  const [activeTab, setActiveTab] = useState<'value' | 'quality' | 'luxury'>('value');

  const getProductsForRoutine = (routine: 'value' | 'quality' | 'luxury'): Product[] => {
    const productList: Product[] = [];
    
    for (let i = 1; i <= 3; i++) {
      const product = {
        name: products[`${routine}_${i}_name` as keyof typeof products] as string,
        price: products[`${routine}_${i}_price` as keyof typeof products] as number,
        image: products[`${routine}_${i}_image` as keyof typeof products] as string,
        url: products[`${routine}_${i}_url` as keyof typeof products] as string,
        brand: products[`${routine}_${i}_brand` as keyof typeof products] as string,
      };
      
      if (product.name) {
        productList.push(product);
      }
    }
    
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
              
              {product.brand && (
                <p className="text-xs text-gray-600">
                  {product.brand}
                </p>
              )}
              
              {product.price && (
                <p className="text-sm font-semibold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              )}
              
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
