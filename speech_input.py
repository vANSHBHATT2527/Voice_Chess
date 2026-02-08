import speech_recognition as sr

class SpeechInput:
    def __init__(self):
        self.recognizer = sr.Recognizer()

        # IMPORTANT: manual energy settings (fixes timeout issue)
        self.recognizer.dynamic_energy_threshold = False
        self.recognizer.energy_threshold = 300

        self.microphone = sr.Microphone(device_index=5)

    def listen(self):
        with self.microphone as source:
            try:
                audio = self.recognizer.listen(
                    source,
                    timeout=8,
                    phrase_time_limit=5
                )
            except sr.WaitTimeoutError:
                return None

        try:
            return self.recognizer.recognize_google(audio).lower()
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            return None
