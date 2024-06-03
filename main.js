import SpeechRecognizer from './speechRecognizer.js';
import AudioAnalyzer from './audioAnalyzer.js';

const inputType = 'microfono';
const outputElement = document.querySelector('.output');
const feedback = document.querySelector('.feedback');
const recognitionLang = 'it-IT';
const recognitionTimeout = 10000;
const commands = ['Segreteria Telefonica', 'Vodafone', 'TIM', 'Iliad', 'Poste Mobile', 'Telecom', 'FastWeb', 'Tiscali', 'Kena'];
 


const recognizer = new SpeechRecognizer(inputType, outputElement, feedback, recognitionLang, recognitionTimeout, commands);


const analyzer = new AudioAnalyzer();
analyzer.init();