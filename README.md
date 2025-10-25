# Referee Assignment App

A React Native Expo app for referee assignment management with login and registration screens.

## Features

- **Login Screen**: Email/password authentication with app logo
- **Register Screen**: User registration with name, email, password, and user type selection (Referee/Admin)
- **Modern UI**: Clean design with rounded inputs, proper spacing, and blue primary color
- **Navigation**: Smooth navigation between login and register screens

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on your phone)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## Project Structure

```
├── App.js                 # Main app component with navigation
├── screens/
│   ├── LoginScreen.js     # Login screen component
│   └── RegisterScreen.js  # Register screen component
├── package.json
└── README.md
```

## Screens

### Login Screen
- App logo with football emoji
- Email input field
- Password input field
- Login button
- Link to register screen

### Register Screen
- First name and last name inputs
- Email input field
- Password input field
- User type selection (Referee/Admin)
- Register button
- Back navigation to login screen

## Styling

The app uses a modern, clean design with:
- White background
- Blue primary color (#007AFF)
- Rounded input fields
- Proper spacing and typography
- Responsive layout with keyboard avoidance
