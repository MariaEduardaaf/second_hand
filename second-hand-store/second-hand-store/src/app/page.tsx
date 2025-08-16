'use client'

import { useState, useEffect } from 'react';
import { ShoppingBag, Leaf, Recycle, Heart, Star, ArrowRight, Globe, Menu, X, Sun, Moon } from 'lucide-react';

// Translation system
type Translations = {
  [key: string]: any;
};

const loadTranslations = async (lang: string): Promise<Translations> => {
  try {
    const translations = await import(`../translations/${lang.toLowerCase()}.json`);
    return translations.default;
  } catch (error) {
    const fallback = await import('../translations/en.json');
    return fallback.default;
  }
};

interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  size: string;
  material: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentLang, setCurrentLang] = useState('EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [translations, setTranslations] = useState<Translations>({});
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadLangTranslations = async () => {
      const langCode = currentLang.toLowerCase() === 'en' ? 'en' : 
                     currentLang.toLowerCase() === 'es' ? 'es' :
                     currentLang.toLowerCase() === 'pt' ? 'pt' : 
                     currentLang.toLowerCase() === 'ru' ? 'ru' : 'en';
      
      const trans = await loadTranslations(langCode);
      setTranslations(trans);
      setIsTranslationsLoaded(true);
    };
    
    loadLangTranslations();
  }, [currentLang]);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const products: Product[] = [
    {
      id: '1',
      name: t('productData.vintageDenim'),
      price: 89.99,
      condition: t('productData.excellent'),
      size: 'M',
      material: t('productData.cotton'),
      image: ''
    },
    {
      id: '2',
      name: t('productData.woolSweater'),
      price: 65.50,
      condition: t('productData.good'),
      size: 'L',
      material: t('productData.wool'),
      image: ''
    },
    {
      id: '3',
      name: t('productData.silkDress'),
      price: 125.00,
      condition: t('productData.excellent'),
      size: 'S',
      material: t('productData.silk'),
      image: ''
    },
    {
      id: '4',
      name: t('productData.leatherBoots'),
      price: 199.99,
      condition: t('productData.good'),
      size: '42',
      material: t('productData.leather'),
      image: ''
    }
  ];

  const languages = [
    { code: 'EN', flag: '🇺🇸', name: 'English' },
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
    { code: 'PT', flag: '🇧🇷', name: 'Português' },
    { code: 'RU', flag: '🇷🇺', name: 'Русский' }
  ];

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Show success message
    alert(`${product.name} ${t('messages.addedToCart')}`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (!isTranslationsLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-4 w-4" />
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 backdrop-blur-md sticky top-0 z-50 glow-effect ${
        isDarkMode 
          ? 'border-gray-700 bg-gray-900/95 text-white' 
          : 'border-gray-200 bg-white/95 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">SECOND HAND</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('home')} className={`font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}>{t('nav.home')}</button>
              <button onClick={() => scrollToSection('products')} className={`font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}>{t('nav.shop')}</button>
              <button onClick={() => scrollToSection('about')} className={`font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}>{t('nav.about')}</button>
              <button onClick={() => scrollToSection('contact')} className={`font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}>{t('nav.contact')}</button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Language Selector */}
              <div className="relative group">
                <button className={`flex items-center space-x-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}>
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:block text-sm">{currentLang}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setCurrentLang(lang.code)}
                      className={`flex items-center w-full px-3 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Button */}
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`p-2 relative transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                    isDarkMode ? 'bg-white text-gray-900' : 'bg-black text-white'
                  }`}>
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-black"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 border-t pt-4 transition-colors duration-300 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <nav className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('home')} className={`text-left font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}>{t('nav.home')}</button>
                <button onClick={() => scrollToSection('products')} className={`text-left font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}>{t('nav.shop')}</button>
                <button onClick={() => scrollToSection('about')} className={`text-left font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}>{t('nav.about')}</button>
                <button onClick={() => scrollToSection('contact')} className={`text-left font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}>{t('nav.contact')}</button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('cart.title')}</h2>
              <button onClick={() => setIsCartOpen(false)} className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className={`text-center mt-8 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{t('cart.empty')}</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className={`flex items-center space-x-3 border-b pb-4 transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <ShoppingBag className={`h-6 w-6 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{item.name}</h3>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>${item.price}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={`w-6 h-6 border rounded text-xs transition-colors duration-300 ${
                              isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            -
                          </button>
                          <span className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`w-6 h-6 border rounded text-xs transition-colors duration-300 ${
                              isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 text-xs transition-colors duration-300"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className={`border-t p-4 transition-colors duration-300 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between mb-4">
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{t('cart.total')}: ${getTotalPrice().toFixed(2)}</span>
                </div>
                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}>
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="py-20 gradient-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 glass-effect mb-8 animate-bounce-custom">
              <Leaf className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm font-medium">{t('hero.sustainable')}</span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 text-shadow transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('hero.title')}
              <br />
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{t('hero.subtitle')}</span>
            </h1>

            <p className={`text-xl mb-8 leading-relaxed font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t('hero.description')}
            </p>

            <div className={`flex justify-center space-x-8 mb-8 text-sm animate-slideInUp transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4" />
                <span>{t('hero.ecoFriendly')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Recycle className="h-4 w-4" />
                <span>{t('hero.sustainable')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{t('hero.quality')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInUp">
              <button 
                onClick={() => scrollToSection('products')}
                className={`px-8 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center glow-effect shadow-lg ${
                  isDarkMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {t('hero.shopNow')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`border-2 px-8 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 glow-effect ${
                  isDarkMode 
                    ? 'border-white text-white hover:bg-white hover:text-gray-900' 
                    : 'border-black text-black hover:bg-black hover:text-white'
                }`}
              >
                {t('hero.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className={`py-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className={`text-4xl font-bold mb-4 text-shadow transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('products.title')}
            </h2>
            <p className={`text-xl font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {t('products.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fadeInUp">
            {products.map((product) => (
              <div key={product.id} className="gradient-card rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 glow-effect">
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-gray-600">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-60 animate-pulse-custom" />
                    <p className="text-sm font-semibold px-4 text-shadow">{product.name}</p>
                  </div>
                  <div className="absolute top-3 left-3 animate-slideInLeft">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-gray-200">
                      {product.condition}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 animate-slideInRight">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 border border-gray-200"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{product.name}</h3>
                  <div className={`flex items-center justify-between text-sm mb-3 font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span>{t('products.size')}: {product.size}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{product.material}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg ${
                        isDarkMode 
                          ? 'bg-white text-gray-900 hover:bg-gray-200' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {t('products.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => alert(t('messages.moreProducts'))}
              className="border border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center mx-auto"
            >
              {t('products.viewAll')}
              <ShoppingBag className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800' 
          : 'bg-gradient-to-r from-gray-50 via-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className={`text-4xl font-bold mb-6 text-shadow transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('about.title')}</h2>
              <p className={`text-lg mb-6 leading-relaxed font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {t('about.description1')}
              </p>
              <p className={`text-lg mb-8 leading-relaxed font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {t('about.description2')}
              </p>
              <button 
                onClick={() => alert(t('messages.learnMore'))}
                className={`px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg glow-effect ${
                  isDarkMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {t('about.ourMission')}
              </button>
            </div>
            <div className="relative animate-slideInRight">
              <div className={`aspect-square rounded-2xl flex items-center justify-center shadow-2xl glow-effect hover:scale-105 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
                  : 'bg-gradient-to-br from-gray-300 to-gray-400'
              }`}>
                <div className={`text-center transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-600'
                }`}>
                  <Recycle className="h-20 w-20 mx-auto mb-4 animate-pulse-custom" />
                  <p className="text-xl font-bold text-shadow">{t('hero.sustainable')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-4xl font-bold mb-4 text-shadow">{t('stats.title')}</h2>
            <p className="text-xl text-gray-200 font-medium">
              {t('stats.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp">
            {[
              { number: '10K+', label: t('stats.customers') },
              { number: '25K+', label: t('stats.items') },
              { number: '5 Tons', label: t('stats.waste') },
              { number: '50+', label: t('stats.brands') }
            ].map((stat, i) => (
              <div key={i} className="text-center hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-6xl font-bold mb-2 text-shadow animate-pulse-custom">
                  {stat.number}
                </div>
                <div className="text-gray-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{t('contact.title')}</h2>
            <p className={`text-xl transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-black'
                    }`}
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-black'
                    }`}
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-300 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-black'
                  }`}
                  placeholder={t('contact.messagePlaceholder')}
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(t('messages.thankYou'));
                  }}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                    isDarkMode 
                      ? 'bg-white text-gray-900 hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {t('contact.send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
                  <Leaf className="h-3 w-3" />
                </div>
                <span className="text-lg font-bold">SECOND HAND</span>
              </div>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('footer.company')}</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>{t('footer.about')}</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-gray-900">{t('footer.contact')}</button></li>
                <li><button onClick={() => alert(t('messages.careers'))} className="hover:text-gray-900">{t('footer.careers')}</button></li>
                <li><button onClick={() => alert(t('messages.sustainabilityPage'))} className="hover:text-gray-900">{t('footer.sustainability')}</button></li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('footer.customerService')}</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => alert(t('messages.helpCenter'))} className="hover:text-gray-900">{t('footer.helpCenter')}</button></li>
                <li><button onClick={() => alert(t('messages.shippingInfo'))} className="hover:text-gray-900">{t('footer.shipping')}</button></li>
                <li><button onClick={() => alert(t('messages.returnsPage'))} className="hover:text-gray-900">{t('footer.returns')}</button></li>
                <li><button onClick={() => alert(t('messages.sizeGuideInfo'))} className="hover:text-gray-900">{t('footer.sizeGuide')}</button></li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('footer.newsletter')}</h3>
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('footer.newsletterDesc')}
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('contact.emailPlaceholder')}
                  className={`flex-1 px-3 py-2 border rounded-l-lg text-sm transition-colors duration-300 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
                <button 
                  onClick={() => alert(t('messages.subscribed'))}
                  className={`px-4 py-2 rounded-r-lg text-sm transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-white text-gray-900 hover:bg-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>

          <div className={`border-t mt-8 pt-8 text-center text-sm transition-colors duration-300 ${
            isDarkMode 
              ? 'border-gray-700 text-gray-400' 
              : 'border-gray-200 text-gray-500'
          }`}>
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}