import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import avisar from '../avisar';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const ingresar = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      // No hay que navegar: onAuthStateChanged en App.js cambia las pestañas
    } catch (error) {
      avisar('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Iniciar sesión</Text>
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo}
        autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" value={contrasena}
        onChangeText={setContrasena} secureTextEntry />
      <Button title="Ingresar" onPress={ingresar} />
      <View style={{ marginTop: 10 }}>
        <Button title="No tengo cuenta" onPress={() => navigation.navigate('Registro')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 6 },
});
