import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { HeroSection } from "./components/HeroSection.jsx";
import { FeaturedCollections } from "./components/FeaturedCollections.jsx";
import { BestsellersSection } from "./components/BestsellersSection.jsx";
import { BrandStory } from "./components/BrandStory.jsx";
import { QuizBanner } from "./components/QuizBanner.jsx";
import { CustomerReviews } from "./components/CustomerReviews.jsx";
import { Footer } from "./components/Footer.jsx";
import { ShopPage } from "./components/ShopPage.jsx";
import { AboutSection } from "./components/AboutSection.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import { NailVibeQuiz } from "./components/NailVibeQuiz.jsx";
import { ProductDetailModal } from "./components/ProductDetailModal.jsx";
import { SizingGuideModal } from "./components/SizingGuideModal.jsx";
import { CustomOrderModal } from "./components/CustomOrderModal.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { AdminPortal } from "./components/AdminPortal.jsx";
import { SpinWheelModal } from "./components/SpinWheelModal.jsx";
import { SpinLauncherBadge } from "./components/SpinLauncherBadge.jsx";
import { JewelleryPage } from "./components/JewelleryPage.jsx";
import { JewelleryDetailModal } from "./components/JewelleryDetailModal.jsx";
import { getStoredProducts, subscribeProducts, syncProductsWithDb } from "./data/productStore.js";
import { Sparkles, X, CheckCircle, Heart, ArrowUp } from "lucide-react";

export function App() {
  // Navigation: 'home' | 'shop' | 'about' | 'contact' | 'admin'
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.hash === "#admin" ? "admin" : "home";
  });

  const handleTabChange = (tab) => {
    if (tab === "admin") {
      window.location.hash = "#admin";
    } else if (window.location.hash === "#admin") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setActiveTab(tab);
  };

  // Dynamic Product Catalog State
  const [products, setProducts] = useState(() => getStoredProducts());

  // Modals & Drawers
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [sizingModalOpen, setSizingModalOpen] = useState(false);
  const [customOrderModalOpen, setCustomOrderModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewJewellery, setQuickViewJewellery] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Spin Wheel Gate: Automatically shown to every visitor and cannot be closed until spin result comes
  const [spinModalOpen, setSpinModalOpen] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.location.hash === "#admin") {
        return false;
      }
      return !sessionStorage.getItem("gog_spin_completed");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (window.location.hash === "#admin") return;
      const completed = sessionStorage.getItem("gog_spin_completed");
      if (!completed) {
        setSpinModalOpen(true);
      }
    } catch {
      setSpinModalOpen(true);
    }
  }, [activeTab]);

  // Shop filter preselection (e.g. when clicking featured collection)
  const [shopCategoryFilter, setShopCategoryFilter] = useState("All");

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("gog_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("gog_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Scroll to Top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("gog_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Cart save error:", err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("gog_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error("Wishlist save error:", err);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync with MongoDB Atlas on initial website load
  useEffect(() => {
    syncProductsWithDb()
      .then((dbProducts) => {
        if (dbProducts && Array.isArray(dbProducts)) {
          setProducts(dbProducts);
        }
      })
      .catch((err) => {
        console.warn("MongoDB initial sync notice:", err.message);
      });
  }, []);

  // Subscribe to dynamic product store updates
  useEffect(() => {
    const unsubscribe = subscribeProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });
    return unsubscribe;
  }, []);

  // Hash route listener (#admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#admin") {
        setActiveTab("admin");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (productWithCustomizations) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === productWithCustomizations.id &&
          item.selectedShape === productWithCustomizations.selectedShape &&
          item.selectedLength === productWithCustomizations.selectedLength &&
          item.selectedSize === productWithCustomizations.selectedSize
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      } else {
        return [...prev, productWithCustomizations];
      }
    });

    showToast(`Added ${productWithCustomizations.name} to your Shopping Bag! 🛍️`);
  };

  const handleUpdateCartQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast("Item removed from your bag");
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Shopping bag cleared");
  };

  // Wishlist Handler
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from your wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to your wishlist! 💖");
        return [...prev, productId];
      }
    });
  };

  // Collection Select -> Opens Shop pre-filtered
  const handleSelectCollection = (collectionTag) => {
    setShopCategoryFilter(collectionTag);
    setActiveTab("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5] text-[#242124] selection:bg-[#F3B6CB] selection:text-[#64263C]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#64263C] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-pink-300">
          <Sparkles className="w-4 h-4 text-[#D6B477]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={totalCartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenQuiz={() => setQuizModalOpen(true)}
        onOpenSizing={() => setSizingModalOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === "home" && (
          <>
            {/* 1. Hero Section */}
            <HeroSection
              onOpenQuiz={() => setQuizModalOpen(true)}
              onExploreShop={() => {
                setActiveTab("shop");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* 2. Featured Collections (6 Aesthetic Worlds) */}
            <FeaturedCollections
              onSelectCollection={handleSelectCollection}
              onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
            />

            {/* 3. Bestsellers Section */}
            <BestsellersSection
              products={products}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onExploreShop={() => {
                handleTabChange("shop");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* 4. Brand Story & 3-Step Process */}
            <BrandStory
              onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
              onOpenQuiz={() => setQuizModalOpen(true)}
            />

            {/* 5. Find Your Nail Vibe Quiz Pink Banner */}
            <QuizBanner onOpenQuiz={() => setQuizModalOpen(true)} />

            {/* 6. Customer UGC Testimonials */}
            <CustomerReviews />
          </>
        )}

        {activeTab === "shop" && (
          <ShopPage
            products={products}
            initialCollectionFilter={shopCategoryFilter}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenQuiz={() => setQuizModalOpen(true)}
          />
        )}

        {activeTab === "jewellery" && (
          <JewelleryPage
            onQuickView={(item) => setQuickViewJewellery(item)}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === "about" && (
          <AboutSection
            setActiveTab={handleTabChange}
            onOpenQuiz={() => setQuizModalOpen(true)}
            onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
          />
        )}

        {activeTab === "contact" && <ContactSection />}

        {activeTab === "admin" && (
          <AdminPortal
            products={products}
            onRefreshProducts={() => setProducts(getStoredProducts())}
            onViewProductInStore={(prod) => setQuickViewProduct(prod)}
            onSwitchToShop={() => {
              handleTabChange("shop");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenQuiz={() => setQuizModalOpen(true)}
        onOpenSizing={() => setSizingModalOpen(true)}
        onOpenCustomOrder={() => setCustomOrderModalOpen(true)}
      />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/90 text-[#64263C] border border-pink-200 shadow-xl hover:bg-[#64263C] hover:text-white transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* =========================================================================
          MODALS & DRAWERS
          ========================================================================= */}

      {/* 1. Signature "Find My Nail Vibe" Interactive Quiz Modal */}
      {quizModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-content-lg">
            {/* Modal Close Button */}
            <button
              onClick={() => setQuizModalOpen(false)}
              className="modal-close-btn"
              aria-label="Close Quiz"
            >
              <X className="w-5 h-5" />
            </button>

            <NailVibeQuiz
              onSelectProduct={(prod) => {
                setQuizModalOpen(false);
                setQuickViewProduct(prod);
              }}
              onExploreShop={() => {
                setQuizModalOpen(false);
                setActiveTab("shop");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onClose={() => setQuizModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 2. Product Detail / Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenSizing={() => {
            setQuickViewProduct(null);
            setSizingModalOpen(true);
          }}
          onOpenCustomOrder={() => {
            setQuickViewProduct(null);
            setCustomOrderModalOpen(true);
          }}
        />
      )}

      {/* 3. Sizing Guide Modal */}
      {sizingModalOpen && (
        <SizingGuideModal onClose={() => setSizingModalOpen(false)} />
      )}

      {/* 4. Custom Atelier Order Modal */}
      {customOrderModalOpen && (
        <CustomOrderModal onClose={() => setCustomOrderModalOpen(false)} />
      )}

      {/* 5. Shopping Bag Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onExploreShop={() => {
          setCartDrawerOpen(false);
          setActiveTab("shop");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* 6. Jewellery Quick View / Detail Modal */}
      {quickViewJewellery && (
        <JewelleryDetailModal
          product={quickViewJewellery}
          onClose={() => setQuickViewJewellery(null)}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 7. Spin the Wheel Promotional Entry Popup */}
      <SpinWheelModal
        isOpen={spinModalOpen}
        onClose={() => setSpinModalOpen(false)}
        onExploreShop={() => {
          setSpinModalOpen(false);
          handleTabChange("shop");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onExploreJewellery={() => {
          setSpinModalOpen(false);
          handleTabChange("jewellery");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* 8. Floating Spin to Win Trigger Badge (Bottom-Left) */}
      <SpinLauncherBadge onClick={() => setSpinModalOpen(true)} />
    </div>
  );
}

export default App;
