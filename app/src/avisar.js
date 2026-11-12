// src/avisar.js: Alert.alert no funciona en el navegador; esto sí funciona en ambos
import { Alert, Platform } from 'react-native';

export default function avisar(titulo, mensaje = '') {
  if (Platform.OS === 'web') window.alert(`${titulo}\n${mensaje}`);
  else Alert.alert(titulo, mensaje);
}
