# Vosk-speech-recognition-offline

## Voice-Controlled Lamp with Firebase and Vosk

This project implements a voice-controlled lamp system using Firebase Realtime Database and the Vosk speech recognition library. The system allows users to control a lamp using voice commands, with the server processing the commands and updating the lamp state in Firebase.

## Features

- Voice command recognition using Vosk
- Real-time communication between client and server using WebSockets
- Firebase Realtime Database integration for lamp state management
- Web interface for visualizing transcriptions and lamp state

## Prerequisites

- Python 3.7+
- Node.js and npm (for running the web interface)
- Vosk speech recognition model
- Firebase account and project

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/voice-controlled-lamp.git
   cd voice-controlled-lamp
   ```

2. Install Python dependencies:
   ```
   pip install vosk pyaudio websockets firebase-admin
   ```

3. Download the Vosk model and place it in the `server/model/` directory.

4. Set up Firebase:
   - Create a Firebase project
   - Download the Firebase Admin SDK JSON file and place it in `server/config/`
   - Update the Firebase configuration in `server.py` and `js/script.js`

5. Install JavaScript dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   python server.py
   ```

2. Open `index.html` in a web browser or serve it using a local server.

3. Speak the wake word "prisca" followed by your command, such as "allume la lampe" or "éteins la lampe".

## Project Structure

- `server.py`: Main server script handling speech recognition and Firebase communication
- `index.html`: Web interface for displaying transcriptions and lamp state
- `js/script.js`: Client-side JavaScript for WebSocket communication and UI updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vosk](https://github.com/alphacep/vosk-api) for providing the speech recognition capabilities
- [Firebase](https://firebase.google.com/) for real-time database functionality
- [particles.js](https://vincentgarreau.com/particles.js/) for the background animation
