# 🦊 Random Fox API App

A simple and fun web app that displays random fox images using the RandomFox API.

## 🚀 Features

- **Random Fox Image**: Instantly fetches and displays a new random fox image.
- **Load More**: Get a new fox image with a single click.
- **Favorites**: Save your favorite fox images (using localStorage).
- **Responsive Design**: Works great on desktop and mobile.
- **Theme Toggle**: Switch between Light and Dark modes.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- [RandomFox API](https://randomfox.ca/floof/)

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. **Navigate to the project folder**
   ```sh
   cd Elect_Final_Chaya/RandomFox_Api
   ```
3. **Open `index.html` in your web browser**
   - Double-click `index.html` or right-click and select “Open with” > your browser.

## 🖥️ How to Use

1. Open `index.html` in your web browser.
2. Click the **Load More** button to fetch a new random fox image.
3. Click the star icon to save a fox image to your favorites.
4. View and manage your favorite fox images in the favorites section.
5. Toggle the theme using the moon/sun icon in the header.

## 📄 License

This project is open source and free to use.

## 🙏 Credits

Created by Chaya, December 2025.

---

## 📚 API Reference (RandomFox)

**Base URL:** `https://randomfox.ca/floof/`

**Endpoint:**
- `/floof/` — Returns a random fox image

**Sample JSON Response:**
```json
{
  "image": "https://randomfox.ca/images/123.jpg",
  "link": "https://randomfox.ca/?i=123"
}
```

**Usage:**
- No authentication or API key required.
- Make a GET request to the endpoint to receive a random fox image.
