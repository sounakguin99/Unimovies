# Unimovies 🎬

Unimovies is a modern, responsive movie discovery and tracking web application built with **Next.js**. It provides users with an intuitive interface to browse movies, watch trailers, and explore TV shows.

## ✨ Features

- **Movie & TV Show Discovery**: Browse a vast collection of movies and TV shows.
- **Detailed Information**: View comprehensive details including cast, trailers, and overviews.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing using Tailwind CSS.
- **PWA Support**: Installable as a Progressive Web App (PWA) for a native-like experience on supported devices.
- **Fast Performance**: Optimized loading with lazy-loaded images and skeleton screens.
- **Smooth Animations**: Engaging user interface with Framer Motion animations and sleek carousels.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Auth:** [Firebase](https://firebase.google.com/)
- **Icons:** [FontAwesome](https://fontawesome.com/) & [Tabler Icons](https://tabler-icons.io/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching:** [Axios](https://axios-http.com/)
- **UI Components:** React Slick, React Multi Carousel, React Responsive Carousel

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have Node.js (v18 or higher recommended) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd Unimovies
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your necessary environment variables. The application uses Firebase and likely an external movie API (such as TMDB).

   ```env
   # Example environment variables setup
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # Add your Movie API key here (if applicable)
   NEXT_PUBLIC_API_KEY=your_movie_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production deployment.
- `npm run start`: Starts the production server (requires a build first).
- `npm run lint`: Runs ESLint to analyze the code and catch formatting issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the MIT License.
