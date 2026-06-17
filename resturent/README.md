# FlavorHub - Full-Stack Restaurant Web Application

A complete full-stack restaurant web application with real-time order tracking, dual payment gateway integration, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python Django 5.1 + Django REST Framework |
| Real-time | Django Channels (WebSockets) |
| Database | MySQL |
| Payments | Razorpay + Stripe |
| Auth | JWT (SimpleJWT) |

## Features

- **Authentication** — Register, login, profile management with JWT tokens
- **Menu Management** — Full CRUD for categories and menu items with filtering, search, and sorting
- **Cart System** — Add/remove items, adjust quantities, special instructions
- **Order Placement** — Place orders with delivery details and payment method selection
- **Real-time Order Tracking** — WebSocket-based live status updates with visual progress tracker
- **Admin Dashboard** — Manage orders, menu items, and users with real-time updates
- **Payment Integration** — Razorpay (INR) and Stripe (USD) checkout, plus cash on delivery
- **Responsive UI** — Mobile-first design with Tailwind CSS

## Project Structure

```
resturent/
├── backend/                      # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── restaurant_project/       # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   └── routing.py
│   └── apps/
│       ├── authentication/       # User auth (JWT)
│       ├── menu/                 # Menu categories & items
│       ├── cart/                 # Shopping cart
│       ├── orders/               # Orders & WebSocket consumer
│       └── payments/             # Razorpay & Stripe
├── frontend/                     # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── api/                  # Axios API layer
│       ├── components/           # Reusable UI components
│       ├── context/              # Auth & Cart context
│       ├── hooks/                # WebSocket hook
│       ├── pages/                # All pages
│       │   └── admin/            # Admin dashboard pages
│       └── utils/                # Constants & helpers
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Redis (for Django Channels)

## Setup Instructions

### 1. Clone and Navigate

```bash
cd resturent
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys
```

#### Configure MySQL Database

```bash
# Log into MySQL
mysql -u root -p

# Create the database
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

#### Load Sample Data (Optional)

```bash
python manage.py shell
```

```python
from apps.menu.models import Category, MenuItem

# Create categories
indian = Category.objects.create(name="Indian", slug="indian", description="Authentic Indian cuisine")
chinese = Category.objects.create(name="Chinese", slug="chinese", description="Delicious Chinese dishes")
italian = Category.objects.create(name="Italian", slug="italian", description="Classic Italian food")
desserts = Category.objects.create(name="Desserts", slug="desserts", description="Sweet endings")

# Create menu items
MenuItem.objects.create(name="Butter Chicken", slug="butter-chicken", price=350, category=indian, is_vegetarian=False, is_spicy=True, preparation_time=25)
MenuItem.objects.create(name="Paneer Tikka", slug="paneer-tikka", price=280, category=indian, is_vegetarian=True, is_spicy=True, preparation_time=20)
MenuItem.objects.create(name="Fried Rice", slug="fried-rice", price=220, category=chinese, is_vegetarian=True, is_spicy=False, preparation_time=15)
MenuItem.objects.create(name="Kung Pao Chicken", slug="kung-pao-chicken", price=320, category=chinese, is_vegetarian=False, is_spicy=True, preparation_time=20)
MenuItem.objects.create(name="Margherita Pizza", slug="margherita-pizza", price=400, category=italian, is_vegetarian=True, is_spicy=False, preparation_time=30)
MenuItem.objects.create(name="Pasta Carbonara", slug="pasta-carbonara", price=380, category=italian, is_vegetarian=False, is_spicy=False, preparation_time=25)
MenuItem.objects.create(name="Gulab Jamun", slug="gulab-jamun", price=150, category=desserts, is_vegetarian=True, is_spicy=False, preparation_time=10)
MenuItem.objects.create(name="Tiramisu", slug="tiramisu", price=300, category=desserts, is_vegetarian=True, is_spicy=False, preparation_time=15)

exit()
```

#### Start Backend Server

```bash
# Start Daphne (ASGI server for HTTP + WebSocket)
daphne -b 0.0.0.0 -p 8000 restaurant_project.asgi:application

# OR use Django's development server (no WebSocket support):
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`  
API docs at `http://localhost:8000/api/docs/`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env if needed (default values should work for local development)

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Start Redis (for WebSocket support)

```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or install Redis locally
# On Ubuntu:
sudo apt install redis-server
sudo systemctl start redis-server

# On macOS:
brew install redis
brew services start redis
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT) |
| POST | `/api/auth/token/refresh/` | Refresh JWT token |
| GET | `/api/auth/profile/` | Get user profile |
| PATCH | `/api/auth/profile/` | Update profile |
| PUT | `/api/auth/change-password/` | Change password |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu/categories/` | List categories |
| GET/POST | `/api/menu/items/` | List/Create items |
| GET/PATCH/DELETE | `/api/menu/items/{slug}/` | Item detail |
| GET | `/api/menu/items/featured/` | Featured items |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/` | Get cart |
| POST | `/api/cart/add/` | Add item to cart |
| PATCH | `/api/cart/items/{id}/` | Update cart item |
| DELETE | `/api/cart/items/{id}/remove/` | Remove item |
| DELETE | `/api/cart/clear/` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List orders |
| GET | `/api/orders/my-orders/` | User's orders |
| POST | `/api/orders/` | Create order |
| GET | `/api/orders/{id}/` | Order detail |
| POST | `/api/orders/{id}/cancel/` | Cancel order |
| PATCH | `/api/orders/{id}/status/` | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/razorpay/create/` | Create Razorpay order |
| POST | `/api/payments/razorpay/verify/` | Verify Razorpay payment |
| POST | `/api/payments/stripe/create/` | Create Stripe checkout |
| POST | `/api/payments/stripe/webhook/` | Stripe webhook |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `ws://localhost:8000/ws/orders/` | All orders (admin) |
| `ws://localhost:8000/ws/orders/{id}/` | Specific order updates |

## Payment Setup

### Razorpay
1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env`

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Add `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` to `.env`

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=restaurant_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=127.0.0.1
DB_PORT=3306
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/ws
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Running in Production

```bash
# Backend
pip install gunicorn
gunicorn restaurant_project.wsgi:application -b 0.0.0.0:8000

# Frontend
npm run build
# Serve the dist/ folder with Nginx

# WebSocket
daphne -b 0.0.0.0 -p 8000 restaurant_project.asgi:application
```

## Default Admin Access

After running `createsuperuser`, access the Django admin at:
`http://localhost:8000/admin/`

For the React admin dashboard, login with an admin user and navigate to:
`http://localhost:5173/admin`

## License

MIT
