<h3 align="center">
  <div>
        <a style="color:4b90f2" href="https://github.com/ambyte/editson">
            <img src="src/assets/logo.png" width="120" />
            <br>
            Editson
        </a>
    </div>
    <br>
    <b>Modern web-based JSON file editor</b> with intuitive interface and powerful editing capabilities.
</h2>

## 📋 Description

Editson is a modern web application for working with JSON files, built on Vue 3 and Vuetify. The application provides two editing modes: a text editor and a structured object editor for more convenient data manipulation.

## ✨ Key Features

- 📁 **JSON File Upload** - support for loading existing JSON files
- ✏️ **Dual Editing Modes**:
  - **Text View** - classic text-based JSON editor
  - **Object View** - structured editor with visual object representation
- 💾 **Export Results** - download edited JSON files
- 🌙 **Dark/Light Theme** - automatic system theme detection with manual toggle option
- ⚡ **Real-time Validation** - instant JSON error detection
- 📱 **Responsive Design** - optimized for various devices

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **UI Library**: Vuetify 3
- **JSON Editor**: vanilla-jsoneditor & json-editor-vue
- **Build Tool**: Vite
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd editson
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open browser** and navigate to `http://localhost:3000`

### Docker

Editson can be run using Docker, which provides easy deployment and an isolated runtime environment.

#### Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

#### Method 1: Docker Compose (recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd editson
   ```

2. **Run the application**

   ```bash
   docker-compose up -d
   ```

3. **Open browser** and navigate to `http://localhost`

### Docker Hub

To install from the Docker Hub, use the following docker-compose

```bash
services:
  editson:
    image: ambyte/editson:latest
    container_name: editson
    ports:
      - "8082:80"
    restart: unless-stopped
```

## 💡 How to Use

1. **File Upload**: Click on the upload area and select a JSON file from your computer
2. **Editing**:
   - Use "Json View" tab for text-based editing
   - Use "Object View" tab for structured editing
3. **Download**: After making changes, click the "Download" button to save the file

## 🤝 Contributing

We welcome contributions to the project! If you have suggestions for improvements or found a bug:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

If you have questions or issues, please:

- Create an issue in the repository
- Describe the problem in detail
- Include screenshots if helpful

## 📄 License

MIT License
