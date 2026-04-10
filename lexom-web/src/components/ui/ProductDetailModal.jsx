import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeProductModal } from '../../store/modalSlice';
import { addToCart } from '../../store/cartSlice';

const ProductDetailModal = () => {
  const dispatch = useDispatch();
  const { isProductModalOpen, selectedProduct } = useSelector((state) => state.modal);

  if (!isProductModalOpen || !selectedProduct) return null;

  return (
    <AnimatePresence>
      {isProductModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[6px]"
            onClick={() => dispatch(closeProductModal())}
          />

          {/* MODAL CARD */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative bg-[#141414] border-[0.5px] border-[rgba(255,255,255,0.1)] rounded-[20px] max-w-[460px] w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Watch Image */}
            <div className="flex justify-center mb-6 h-[180px]">
              <img
                src={selectedProduct.mappedImage}
                alt={selectedProduct.name}
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Title & Price */}
            <div className="flex flex-col mb-4">
              <h2 className="text-[#F5F5F5] font-['DM_Sans'] font-bold text-[1.3rem] leading-tight">
                {selectedProduct.name}
              </h2>
              <p className="text-[#E8470A] font-['DM_Sans'] font-semibold text-[1rem] mt-1">
                PKR {selectedProduct.price.toLocaleString('en-PK')}
              </p>
            </div>

            {/* Description */}
            <p className="text-[rgba(255,255,255,0.6)] font-['DM_Sans'] font-normal text-[0.875rem] leading-[1.6] mt-4 mb-6">
              {selectedProduct.description}
            </p>

            {/* Specs */}
            <div className="flex flex-wrap gap-[8px] mb-6">
              {selectedProduct.specs.map((spec, index) => (
                <span
                  key={index}
                  className="bg-[rgba(255,255,255,0.06)] border-[0.5px] border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.5)] font-['DM_Sans'] font-normal text-[0.72rem] px-[12px] py-[4px] rounded-full whitespace-nowrap"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[12px] mt-6">
              <button
                onClick={() => {
                  dispatch(addToCart(selectedProduct));
                  dispatch(closeProductModal());
                }}
                className="flex-1 bg-[#F5F5F5] text-[#0A0A0A] font-['DM_Sans'] font-semibold text-[0.85rem] h-[44px] rounded-full hover:bg-white transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                onClick={() => dispatch(closeProductModal())}
                className="flex-1 bg-transparent border-[0.5px] border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.6)] font-['DM_Sans'] font-medium text-[0.85rem] h-[44px] rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
