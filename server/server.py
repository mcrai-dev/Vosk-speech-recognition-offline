# Control a lamp with voice commands using Firebase and Vosk.
#
# This repository contains the server-side code for a system that uses
# Firebase Realtime Database and the Vosk speech recognition library to
# control a lamp with voice commands. The server listens for commands from a
# client and uses the Firebase Realtime Database to control the state of a
# lamp. The server uses the Vosk speech recognition library to recognize
# voice commands and determines the state of the lamp based on the recognized
# command.
#
# The client-side code is not included in this repository.
#
# The system is designed to be used with a Raspberry Pi and a lamp, but
# it can be modified to work with any system that can run Python and
# has a microphone.
import os
import sys
import json
import pyaudio
import re
from vosk import Model, KaldiRecognizer
import asyncio
import websockets
import firebase_admin
from firebase_admin import credentials, db

 # Verifier si le modèle Vosk existe
if not os.path.exists("server/model/"):
    print("No model found.")
    exit(1)

 # Charger le modèle Vosk
model = Model("server/model")
rec = KaldiRecognizer(model, 16000) # 16kHz  rate
keyword = "prisca"   

 # Initialiser PyAudio 
p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000) # 8kHz
stream.start_stream() # lancer le stream 

listening = False # Indicateur pour savoir si le mot clé a été détecté  

 # Initialiser Firebase
cred = credentials.Certificate("server/config/monitoring-423811-firebase-adminsdk-bpbdm-9e45e0795a.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://monitoring-423811-default-rtdb.firebaseio.com'
})

 # Fonctions Firebase 
def set_lamp_state(state):
    ref = db.reference('/Compteur1/Lamp')
    ref.set(state)

# Fonction pour traiter la commande
def interpret_command(text):
    """ Interprète la commande et retourne l'état de la lampe. """
    if re.search(r"\bne\s+pas\b", text):
 
        if re.search(r"\b(allume|allumer)\b", text):
            return 0   
        elif re.search(r"\b(éteint|éteindre)\b", text):
            return 1   
    else:
        if re.search(r"\b(allume|allumer)\b", text):
            return 1   
        elif re.search(r"\b(éteint|éteindre)\b", text):
            return 0   
    return None   

# Lancer le serveur WebSocket et le stream de microphone 
async def recognize(websocket, path):
    global listening
    while True:
        data = stream.read(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = json.loads(rec.Result())
            text = result.get("text", "")
            await websocket.send(json.dumps({"type": "result", "text": text}))
            print(f"Reconnu : {text}")

            if not listening and keyword in text.lower():
                print("Mot clé détecté. Activation de l'écoute...")
                listening = True
                await websocket.send(json.dumps({"type": "keyword_detected"}))

            if listening:
                if text:
                    print(f"Commande : {text}")
                    state = interpret_command(text)
                    if state is not None:
                        set_lamp_state(state)
                    listening = False   
        else:
            partial_result = json.loads(rec.PartialResult())
            partial_text = partial_result.get("partial", "")
            if partial_text:
                await websocket.send(json.dumps({"type": "partial", "text": partial_text}))
                print(f"Résultat partiel : {partial_text}")

start_server = websockets.serve(recognize, "localhost", 8765) 

# Lancer le serveur WebSocket
async def start():
    await start_server

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


