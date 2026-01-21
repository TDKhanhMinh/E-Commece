import {
    MapPinIcon,
    User,
    CreditCardIcon,
    ClipboardListIcon,
    LifeBuoyIcon,
    SettingsIcon,
    Headset,
    Crown,
    ShoppingCart,
    LockKeyhole,
} from "lucide-react";

export const MOCK_CAROUSEL_PRODUCT_ITEMS = [
    {
        id: 1,
        label: "iphone-16-pro-max",
        brand: "Apple",
        name: "iPhone 16 Pro Max Black Titanium 256GB (Unlocked)",
        imgUrl: "https://www.plug.tech/cdn/shop/files/PLUG_HERO_TECH.webp?v=1766780092&width=1000",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1499000,
            old: 1699000,
            currency: "VND",
            discountPercent: 12,
        },
        colors: [
            "bg-primary",
            "bg-secondary",
            "bg-black",
            "bg-white",
            "bg-red",
        ],
        isFavorite: false,
    },
    {
        id: 2,
        label: "iphone-16-pro",
        brand: "Apple",
        name: "iPhone 16 Pro Natural Titanium 128GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1299000,
            old: 1499000,
            currency: "VND",
            discountPercent: 13,
        },
        colors: ["bg-black", "bg-white", "bg-secondary"],
        isFavorite: true,
    },
    {
        id: 3,
        label: "iphone-15",
        brand: "Apple",
        name: "iPhone 15 Blue 128GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 999000,
            old: 1199000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-blue-500", "bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 4,
        label: "samsung-s24-ultra",
        brand: "Samsung",
        name: "Galaxy S24 Ultra 512GB Titanium Gray",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1399000,
            old: 1599000,
            currency: "VND",
            discountPercent: 12,
        },
        colors: ["bg-gray-500", "bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 5,
        label: "samsung-s24",
        brand: "Samsung",
        name: "Galaxy S24 256GB Violet",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1099000,
            old: 1299000,
            currency: "VND",
            discountPercent: 15,
        },
        colors: ["bg-purple-500", "bg-black", "bg-white"],
        isFavorite: true,
    },
    {
        id: 6,
        label: "pixel-9-pro",
        brand: "Google",
        name: "Pixel 9 Pro Obsidian 256GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1199000,
            old: 1399000,
            currency: "VND",
            discountPercent: 14,
        },
        colors: ["bg-black", "bg-white", "bg-green-500"],
        isFavorite: false,
    },
    {
        id: 7,
        label: "xiaomi-14-ultra",
        brand: "Xiaomi",
        name: "Xiaomi 14 Ultra 512GB Black",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 999000,
            old: 1199000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 8,
        label: "oppo-find-x7",
        brand: "OPPO",
        name: "OPPO Find X7 Pro 256GB Blue",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1099000,
            old: 1299000,
            currency: "VND",
            discountPercent: 15,
        },
        colors: ["bg-blue-500", "bg-black"],
        isFavorite: false,
    },
    {
        id: 9,
        label: "vivo-x100-pro",
        brand: "Vivo",
        name: "Vivo X100 Pro 512GB Black",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1049000,
            old: 1249000,
            currency: "VND",
            discountPercent: 16,
        },
        colors: ["bg-black", "bg-red"],
        isFavorite: true,
    },
    {
        id: 10,
        label: "oneplus-12",
        brand: "OnePlus",
        name: "OnePlus 12 256GB Emerald Green",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 949000,
            old: 1149000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-green-500", "bg-black"],
        isFavorite: false,
    },
];
export const MOCK_IMAGES = [
    "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Front.png?v=1714075683&width=823",
    "https://www.plug.tech/cdn/shop/files/iPhone_1_2c3f168a-47be-427d-b556-5da7089de057.png?v=1726846779&width=823",
    "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Dual.png?v=1714075675&width=823",
    "https://www.plug.tech/cdn/shop/files/factoryunlockedre_ba6016ff-cc16-4f79-b1cb-bf558065efd4.jpg?v=1726846786&width=823",
    "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Back.png?v=1714075690&width=823",
];
export const MOCK_CAROUSEL_ITEMS = [
    {
        label: "iphone",
        title: "Seamless. Secure. Simply iPhone.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/4_1f8415dc-f90e-461a-98d0-5dae5f021a60.png?v=1749051534&width=500",
    },
    {
        label: "android",
        title: "Explore Top Android Picks.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/6_649e52d3-db65-405c-a1c6-d59a189f1dba.png?v=1749051542&width=500",
    },
    {
        label: "ipads",
        title: "Work hard. Play smart",
        imgUrl: "https://www.plug.tech/cdn/shop/files/5_c5c5586e-ab16-423a-8b3f-89f004f84143.png?v=1749051922&width=500",
    },
    {
        label: "macbooks",
        title: "Stay connected, Stay active.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
    },
    {
        label: "audio",
        title: "Certified beats, Everyday vibes.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/Untitled_500x500px_52_3f2ef5a5-d0cd-4554-a188-d00a2e3ac59e.png?v=1746197540&width=500",
    },
    {
        label: "smartwatches",
        title: "Stay connected, Stay active.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
    },
    {
        label: "Plug packs",
        title: "Ready make bundles, Curated by Plug.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
    },
];
export const MOCK_FAQ = [
    {
        question: "What condition are Plug devices in?",
        answer: "All Plug devices are Certified Pre-Owned and graded by condition—Excellent, Good, or Fair—so you always know what to expect. Every device is cleaned, tested, and fully functional, no matter the grade.",
    },
    {
        question: "Do Plug devices come with accessories?",
        answer: "Yes, most devices come with high-quality charging cables and necessary accessories. Please check the specific product description for details.",
    },
    {
        question: "What if I'm not happy with my order?",
        answer: "We offer a hassle-free return policy. If you're not satisfied, you can return your device within the specified timeframe for a refund or exchange.",
    },
    {
        question: "How fast will my order ship?",
        answer: "Orders are typically processed within 24 hours and shipped via standard or expedited methods depending on your choice at checkout.",
    },
    {
        question: "Are Plug devices original and authentic?",
        answer: "Absolutely. We guarantee that all devices sold are 100% authentic and have undergone rigorous multi-point inspections.",
    },
];
export const MOCK_CONTENT_ITEMS = [
    {
        title: "Certified Quality",
        description:
            "Each device undergoes rigorous testing to ensure it meets our high standards for performance and reliability.",
    },
    {
        title: "30-Day “Love It or Return It” Guarantee",
        description:
            "Try it, test it, love it. If not, send it back within 30 days for a full refund. Zero stress, zero risk.",
    },
    {
        title: "Certified Quality, 90+ Point Inspection",
        description:
            "Every device passes Plug’s rigorous testing, cleaning, and grading process for dependable performance from day one.",
    },
];
export const MOCK_ABOUT_US_PRODUCT_ITEMS = [
    {
        id: 1,
        title: "Premium Quality You Can Feel",
        description:
            "Only top-tier devices that meet our highest standards make the cut. Every Plug device is hand-selected for exceptional quality with original components, strong battery health, and the reliable performance you expect from premium tech. No shortcuts, no guesswork just high-grade devices that look great, feel great, and deliver a like-new experience.",
        image: "https://www.plug.tech/cdn/shop/files/1_1_849b84c6-360e-435d-858a-ce64226883ce.jpg?v=1767904829&width=800",
    },
    {
        id: 2,
        title: "A Premium, Gift-Ready Unboxing Experience",
        description:
            "Certified Pre-Owned should still feel special. Your device arrives in beautifully designed Plug packaging with careful protection, clean presentation, and a ready-to-use setup. Whether it's for you or a gift, the experience is intentionally elevated from the moment you open the box.",
        image: "https://www.plug.tech/cdn/shop/files/2_1.jpg?v=1767904875&width=800",
    },
    {
        id: 3,
        title: "Recommended by The New York Times",
        description:
            "Trusted by leading tech reviewers. Chosen by millions. Plug has been recommended by The New York Times’ Wirecutter for quality, reliability, and value, recognition that reflects our commitment to delivering Certified Pre-Owned tech you can feel confident about.",
        image: "https://www.plug.tech/cdn/shop/files/3_e41836d7-f233-4c5a-8951-5fcd46e7363d.jpg?v=1767904889&width=800",
    },
    {
        id: 4,
        title: "Planet-Positive by Design",
        description:
            "Better tech, smaller footprint. Every Plug device keeps high-quality electronics out of landfills and extends the life of valuable materials. With R2-certified processes and over 1M+ pounds of tech diverted from waste since 2021, choosing Plug helps support a more sustainable future.",
        image: "https://www.plug.tech/cdn/shop/files/4_83bc2381-d131-45b3-bd3c-01e5278d0c7e.jpg?v=1767904899&width=800",
    },
];
export const MOCK_USER_ACTIONS = [
    {
        label: "Profile",
        icon: <User />,
        url: "/user/profile",
    },
    {
        label: "Memberships",
        icon: <Crown />,
        url: "/user/memberships",
    },
    {
        label: "Delivery Addresses",
        icon: <MapPinIcon />,
        url: "/user/addresses",
    },
    {
        label: "Orders",
        icon: <ShoppingCart />,
        url: "/user/orders",
    },
    {
        label: "Help & Support",
        icon: <Headset />,
        url: "/user/support",
    },
    {
        label: "Change Password",
        icon: <LockKeyhole />,
        url: "/user/change-password",
    },
];

export const USER_SIDEBAR_ITEMS = [
    {
        title: "Profile",
        url: "/user/profile",
        icon: User,
    },
    {
        title: "Memberships",
        url: "/user/memberships",
        icon: Crown,
    },
    {
        title: "Delivery Addresses",
        url: "/user/address-delivery",
        icon: MapPinIcon,
    },
    {
        title: "Orders",
        url: "/user/orders",
        icon: ShoppingCart,
    },
    {
        title: "Payment Methods",
        url: "/user/payments",
        icon: CreditCardIcon,
    },
    {
        title: "Help & Support",
        url: "/user/support",
        icon: Headset,
    },
    {
        title: "Change Password",
        url: "/user/change-password",
        icon: LockKeyhole,
    },
    {
        title: "Terms & Conditions",
        url: "/user/terms",
        icon: ClipboardListIcon,
    },
    {
        title: "Privacy Policy",
        url: "/user/privacy",
        icon: LifeBuoyIcon,
    },
    {
        title: "Settings",
        url: "/user/settings",
        icon: SettingsIcon,
    },
];

export const USER_MEMBERSHIPS_TABS = [
    {
        label: "Member",
        value: "member",
        content: [
            "Nhận 1 điểm thưởng cho mỗi 100.000 VNĐ chi tiêu.",
            "Ưu đãi giảm 5% cho một số phụ kiện chọn lọc (tai nghe, chuột, bàn phím).",
            "Thông báo sớm về các chương trình Flash Sale.",
        ],
    },
    {
        label: "Silver",
        value: "silver",
        content: [
            "Giảm giá 5% cho sản phẩm điện tử dưới 10 triệu VNĐ.",
            "Giảm giá 7% cho phụ kiện (tai nghe, chuột, sạc…).",
            "Miễn phí vận chuyển cho đơn hàng trên 2 triệu VNĐ.",
            "Hỗ trợ kỹ thuật online miễn phí 1 lần/tháng.",
        ],
    },
    {
        label: "Gold",
        value: "gold",
        content: [
            "- Giảm giá 7% cho sản phẩm điện tử dưới 15 triệu VNĐ.",
            "- Giảm giá 10% cho phụ kiện và linh kiện.",
            "- Miễn phí vận chuyển toàn quốc cho đơn hàng trên 1 triệu VNĐ.",
            "- Bảo hành mở rộng thêm 3 tháng cho 1 sản phẩm/năm.",
            "- Ưu tiên tham gia các chương trình khuyến mãi giới hạn số lượng.",
        ],
    },
    {
        label: "Platinum",
        value: "platinum",
        content: [
            "- Giảm giá 10% cho sản phẩm điện tử bất kỳ.",
            "- Giảm giá 10% cho sản phẩm điện tử bất kỳ.",
            "- Giảm giá 12% cho phụ kiện và linh kiện.",
            "- Miễn phí vận chuyển không giới hạn.",
            "- Bảo hành mở rộng thêm 6 tháng cho 2 sản phẩm/năm.",
            "- Tặng voucher 500.000 VNĐ khi nâng cấp laptop/PC.",
        ],
    },
    {
        label: "Diamond",
        value: "diamond",
        content: [
            "- Giảm giá 15% cho toàn bộ sản phẩm điện tử và phụ kiện.",
            "- Giảm giá 15% cho toàn bộ sản phẩm điện tử và phụ kiện.",
            "- Bảo hành mở rộng thêm 12 tháng cho 3 sản phẩm/năm.",
            "- Miễn phí vệ sinh/làm mới laptop 2 lần/năm.",
            "- Hỗ trợ kỹ thuật VIP 24/7.",
            "- Tặng voucher 1.000.000 VNĐ khi mua điện thoại hoặc laptop mới.",
            "- Tham gia sự kiện ra mắt sản phẩm và trải nghiệm công nghệ độc quyền.",
        ],
    },
];
