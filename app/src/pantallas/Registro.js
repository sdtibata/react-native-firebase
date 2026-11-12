import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import avisar from '../avisar';

export default function Registro({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');

  const registrar = async () => {
    try {
      // 1. Crea el usuario en Authentication
      const { user } = await createUserWithEmailAndPassword(auth, correo, contrasena);
      // 2. Guarda sus datos en Firestore; el id del documento es su uid
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre, correo, fecha, telefono, ganados: 0, perdidos: 0,
      });
      // Al registrarse queda con sesión iniciada: App.js lo lleva a Inicio
    } catch (error) {
      avisar('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registro</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo}
        autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña (mínimo 6)" value={contrasena}
        onChangeText={setContrasena} secureTextEntry />
      <TextInput style={styles.input} placeholder="Fecha de nacimiento (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono}
        keyboardType="phone-pad" />
      <Button title="Registrarme" onPress={registrar} />
      <View style={{ marginTop: 10 }}>
        <Button title="Ya tengo cuenta" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 6 },
});
