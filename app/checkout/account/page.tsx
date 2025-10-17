"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  SettingsIcon,
  PackageIcon,
  TruckIcon,
  CreditCardIcon,
  BellIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  EyeIcon,
  EditIcon,
  SaveIcon
} from "lucide-react";
import { useColorScheme } from "../ColorSchemeProvider";

// Mock user data
const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  phone: "+1 (555) 123-4567",
  address: {
    street: "123 Main Street",
    city: "Anytown",
    state: "CA",
    zip: "90210",
    country: "USA"
  },
  memberSince: "January 2023",
  totalOrders: 47,
  totalSpent: 2847.93,
  loyaltyPoints: 2847
};

// Mock order history
const orderHistory = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 89.97,
    items: 3,
    trackingNumber: "1Z999AA1012345678"
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "Shipped",
    total: 156.45,
    items: 2,
    trackingNumber: "1Z999AA1098765432"
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "Processing",
    total: 234.99,
    items: 5,
    trackingNumber: null
  }
];

// Mock wishlist
const wishlistItems = [
  {
    id: 201,
    name: "Gaming Chair Pro",
    price: 299.99,
    image: "🪑",
    inStock: true
  },
  {
    id: 202,
    name: "4K Webcam",
    price: 199.99,
    image: "📹",
    inStock: false
  },
  {
    id: 203,
    name: "Mechanical Keyboard",
    price: 149.99,
    image: "⌨️",
    inStock: true
  }
];

export default function AccountPage() {
  const { colors } = useColorScheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(mockUser);
  const [clickCount, setClickCount] = useState(0);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "orders", label: "Orders", icon: ShoppingBagIcon },
    { id: "wishlist", label: "Wishlist", icon: HeartIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    setClickCount(prev => prev + 1);

    // Track profile update
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Profile Update', {
        fields_changed: 'contact_info',
        edit_count: clickCount + 1
      });
    }
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));

    // Track notification preference
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Notification Setting Change', {
        notification_type: key,
        enabled: !notifications[key as keyof typeof notifications]
      });
    }
  };

  const removeFromWishlist = (itemId: number) => {
    // Track wishlist removal
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Remove from Wishlist', {
        product_id: itemId,
        product_name: wishlistItems.find(item => item.id === itemId)?.name
      });
    }
  };

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Account Page', {
        active_tab: activeTab,
        total_orders: mockUser.totalOrders,
        loyalty_points: mockUser.loyaltyPoints
      });
    }
  }, [activeTab]);

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}>
            {userInfo.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {userInfo.name}!</h2>
            <p className="text-gray-600">Member since {userInfo.memberSince}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{userInfo.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">${userInfo.totalSpent.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{userInfo.loyaltyPoints}</div>
            <div className="text-sm text-gray-600">Loyalty Points</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Contact Information</h3>
          <Button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            variant="outline"
            size="sm"
            className="hover:bg-opacity-90 active:scale-95 transition-all"
          >
            {isEditing ? <SaveIcon className="h-4 w-4 mr-2" /> : <EditIcon className="h-4 w-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              {isEditing ? (
                <Input
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <span>{userInfo.name}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-gray-400" />
              {isEditing ? (
                <Input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <span>{userInfo.email}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              {isEditing ? (
                <Input
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <span>{userInfo.phone}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-4 w-4 text-gray-400 mt-1" />
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Street Address"
                    value={userInfo.address.street}
                    onChange={(e) => setUserInfo(prev => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value }
                    }))}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={userInfo.address.city}
                      onChange={(e) => setUserInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="State"
                      value={userInfo.address.state}
                      onChange={(e) => setUserInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="ZIP"
                      value={userInfo.address.zip}
                      onChange={(e) => setUserInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, zip: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div>{userInfo.address.street}</div>
                  <div>{userInfo.address.city}, {userInfo.address.state} {userInfo.address.zip}</div>
                  <div>{userInfo.address.country}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {clickCount > 0 && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
            ✅ Profile updated {clickCount} time{clickCount !== 1 ? 's' : ''}!
            {clickCount >= 5 && " 🎉 You're really customizing your profile!"}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Order History</h3>
      {orderHistory.map(order => (
        <div key={order.id} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{order.id}</h4>
              <p className="text-gray-600">Ordered on {order.date}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-gray-400" />
              <span>{order.items} items</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4 text-gray-400" />
              <span>${order.total}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="hover:bg-opacity-90 active:scale-95 transition-all">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {order.trackingNumber && (
              <Button size="sm" variant="outline" className="hover:bg-opacity-90 active:scale-95 transition-all">
                <TruckIcon className="h-4 w-4 mr-2" />
                Track Package
              </Button>
            )}
            {order.status === 'Delivered' && (
              <Button size="sm" variant="outline" className="hover:bg-opacity-90 active:scale-95 transition-all">
                <StarIcon className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderWishlistTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">My Wishlist ({wishlistItems.length} items)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map(item => (
          <div key={item.id} className="bg-white border rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{item.image}</div>
              <h4 className="font-semibold">{item.name}</h4>
              <div className="text-xl font-bold mt-2" style={{ color: colors.primary }}>${item.price}</div>
            </div>

            <div className={`text-center text-sm mb-4 ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {item.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </div>

            <div className="space-y-2">
              <Button
                className="w-full hover:bg-opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
                disabled={!item.inStock}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 border-red-600 hover:bg-red-50 hover:bg-opacity-90 active:scale-95 transition-all"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove from Wishlist
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Account Settings</h3>

      {/* Notification Preferences */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          Notification Preferences
        </h4>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {key === 'orderUpdates' ? 'Order Updates' :
                   key === 'promotions' ? 'Promotional Emails' :
                   key === 'newsletter' ? 'Newsletter' :
                   'SMS Notifications'}
                </div>
                <div className="text-sm text-gray-600">
                  {key === 'orderUpdates' ? 'Get notified about your order status' :
                   key === 'promotions' ? 'Receive special offers and deals' :
                   key === 'newsletter' ? 'Weekly updates and new product announcements' :
                   'Urgent order updates via text message'}
                </div>
              </div>
              <Button
                size="sm"
                variant={value ? "default" : "outline"}
                onClick={() => handleNotificationToggle(key)}
                className={value ? "bg-green-600 hover:bg-green-700 active:scale-95 transition-all" : "hover:bg-opacity-90 active:scale-95 transition-all"}
              >
                {value ? 'ON' : 'OFF'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="font-semibold mb-4">Account Actions</h4>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start hover:bg-opacity-90 active:scale-95 transition-all">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start hover:bg-opacity-90 active:scale-95 transition-all">
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50 hover:bg-opacity-90 active:scale-95 transition-all">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Interactive Widget */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
        <h4 className="font-bold text-center mb-4">🎮 Account Activity Game</h4>
        <p className="text-center text-gray-700 mb-4">
          Toggle your notification settings to see your engagement score!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(notifications).filter(Boolean).length}/4
            </div>
            <div className="text-sm text-gray-600">Notifications Enabled</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-pink-600">
              {Math.round((Object.values(notifications).filter(Boolean).length / 4) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Engagement Score</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(Object.values(notifications).filter(Boolean).length / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  My Account
                </h1>
                <p className="mx-auto max-w-[700px] text-xl">
                  Manage your profile, orders, and preferences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Content */}
        <section className="w-full py-8 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <nav className="space-y-2">
                    {tabs.map(tab => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="w-full justify-start hover:bg-opacity-90 active:scale-95 transition-all"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </Button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === "profile" && renderProfileTab()}
                {activeTab === "orders" && renderOrdersTab()}
                {activeTab === "wishlist" && renderWishlistTab()}
                {activeTab === "settings" && renderSettingsTab()}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}